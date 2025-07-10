-- Script completo para configurar la tabla profiles y permisos
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Crear tabla profiles si no existe
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  trivia_last_played DATE,
  jugador_last_played DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS profiles_points_idx ON profiles(points DESC);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 5. Crear políticas de seguridad
-- Política para que los usuarios puedan ver todos los perfiles (para rankings)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Política para que los usuarios puedan insertar su propio perfil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para que los usuarios solo puedan actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- 8. Crear trigger para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, points, games_won, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'Usuario' || substr(new.id::text, 1, 8)),
    new.email,
    0,
    0,
    now()
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- 10. Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 11. Crear trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Crear perfiles para usuarios existentes que no tengan perfil
INSERT INTO public.profiles (id, username, email, points, games_won, created_at)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', 'Usuario' || substr(u.id::text, 1, 8)),
  u.email,
  0,
  0,
  now()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 13. Verificar que todo está funcionando
SELECT 
  'Tabla profiles creada' as status,
  COUNT(*) as total_profiles
FROM profiles;

-- 14. Mostrar usuarios sin perfil (debería ser 0)
SELECT 
  'Usuarios sin perfil' as status,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;
