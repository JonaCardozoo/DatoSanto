-- Primero, eliminar el trigger existente que no funciona
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear una función mejorada para manejar nuevos usuarios
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

-- Crear el trigger nuevamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar si hay usuarios sin perfil y crearlos
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
WHERE p.id IS NULL;
