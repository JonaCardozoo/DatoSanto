-- ============================================
-- SCRIPT DEFINITIVO PARA FUTFACTOS
-- Ejecutar TODO este script en Supabase SQL Editor
-- ============================================

-- 1. LIMPIAR TODO LO EXISTENTE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Eliminar tabla si existe
DROP TABLE IF EXISTS profiles;

-- 2. CREAR TABLA PROFILES DESDE CERO
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL,
  games_won INTEGER DEFAULT 0 NOT NULL,
  trivia_last_played DATE,
  jugador_last_played DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. CREAR ÍNDICES PARA RENDIMIENTO
CREATE INDEX profiles_points_idx ON profiles(points DESC);
CREATE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_created_at_idx ON profiles(created_at);

-- 4. HABILITAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. CREAR POLÍTICAS DE SEGURIDAD
-- Todos pueden ver perfiles (para rankings)
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

-- Solo el dueño puede insertar su perfil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Solo el dueño puede actualizar su perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. FUNCIÓN PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. TRIGGER PARA updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Generar username desde metadata o email
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'Usuario' || substr(NEW.id::text, 1, 8)
  );
  
  -- Insertar perfil
  INSERT INTO public.profiles (
    id, 
    username, 
    email, 
    points, 
    games_won, 
    created_at, 
    updated_at
  ) VALUES (
    NEW.id,
    user_name,
    NEW.email,
    0,
    0,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Si falla, no bloquear el registro del usuario
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- 9. TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. CREAR PERFILES PARA USUARIOS EXISTENTES
INSERT INTO public.profiles (id, username, email, points, games_won, created_at, updated_at)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'username',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1),
    'Usuario' || substr(u.id::text, 1, 8)
  ) as username,
  u.email,
  0 as points,
  0 as games_won,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 11. FUNCIÓN PARA VERIFICAR CONFIGURACIÓN
CREATE OR REPLACE FUNCTION check_profiles_setup()
RETURNS TABLE(
  check_name TEXT,
  status TEXT,
  details TEXT
) AS $$
BEGIN
  -- Verificar tabla
  RETURN QUERY SELECT 
    'Table exists'::TEXT,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
         THEN 'OK' ELSE 'FAIL' END::TEXT,
    'profiles table'::TEXT;
    
  -- Verificar RLS
  RETURN QUERY SELECT 
    'RLS enabled'::TEXT,
    CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles') 
         THEN 'OK' ELSE 'FAIL' END::TEXT,
    'Row Level Security'::TEXT;
    
  -- Verificar políticas
  RETURN QUERY SELECT 
    'Policies count'::TEXT,
    (SELECT COUNT(*)::TEXT FROM pg_policies WHERE tablename = 'profiles')::TEXT,
    'Should be 3'::TEXT;
    
  -- Verificar triggers
  RETURN QUERY SELECT 
    'Triggers count'::TEXT,
    (SELECT COUNT(*)::TEXT FROM information_schema.triggers WHERE event_object_table = 'profiles')::TEXT,
    'Should be 1'::TEXT;
    
  -- Verificar perfiles
  RETURN QUERY SELECT 
    'Profiles count'::TEXT,
    (SELECT COUNT(*)::TEXT FROM profiles)::TEXT,
    'Total profiles created'::TEXT;
    
  -- Verificar usuarios sin perfil
  RETURN QUERY SELECT 
    'Users without profile'::TEXT,
    (SELECT COUNT(*)::TEXT FROM auth.users u LEFT JOIN profiles p ON u.id = p.id WHERE p.id IS NULL)::TEXT,
    'Should be 0'::TEXT;
END;
$$ language plpgsql security definer;

-- 12. EJECUTAR VERIFICACIÓN
SELECT * FROM check_profiles_setup();

-- 13. MOSTRAR RESUMEN
SELECT 
  'SETUP COMPLETED' as status,
  COUNT(*) as total_profiles,
  MAX(created_at) as last_profile_created
FROM profiles;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
