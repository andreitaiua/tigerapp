-- Location: supabase/migrations/20250122162040_workshop_invoicing_system.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete workshop management with invoicing system
-- Dependencies: Authentication system with user profiles

-- 1. Types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'mechanic', 'receptionist');
CREATE TYPE public.work_order_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.invoice_type AS ENUM ('invoice', 'receipt');
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'cancelled');
CREATE TYPE public.payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'pix');

-- 2. Core Tables
-- User profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'receptionist'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    document_number TEXT, -- CPF/CNPJ
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    plate TEXT,
    color TEXT,
    engine TEXT,
    mileage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Services catalog table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estimated_hours DECIMAL(4,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Inventory/Parts table
CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    quantity_in_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Work orders table
CREATE TABLE public.work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    assigned_mechanic_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status public.work_order_status DEFAULT 'pending'::public.work_order_status,
    problem_description TEXT,
    estimated_completion DATE,
    actual_completion TIMESTAMPTZ,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Work order services (many-to-many)
CREATE TABLE public.work_order_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Work order parts (many-to-many)
CREATE TABLE public.work_order_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table (for both invoices and receipts)
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    invoice_type public.invoice_type NOT NULL,
    status public.invoice_status DEFAULT 'draft'::public.invoice_status,
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method public.payment_method,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Work order history table
CREATE TABLE public.work_order_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    description TEXT,
    performed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_customers_name ON public.customers(name);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_vehicles_customer_id ON public.vehicles(customer_id);
CREATE INDEX idx_vehicles_plate ON public.vehicles(plate);
CREATE INDEX idx_work_orders_customer_id ON public.work_orders(customer_id);
CREATE INDEX idx_work_orders_vehicle_id ON public.work_orders(vehicle_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_work_orders_order_number ON public.work_orders(order_number);
CREATE INDEX idx_work_order_services_work_order_id ON public.work_order_services(work_order_id);
CREATE INDEX idx_work_order_parts_work_order_id ON public.work_order_parts(work_order_id);
CREATE INDEX idx_invoices_work_order_id ON public.invoices(work_order_id);
CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_work_order_history_work_order_id ON public.work_order_history(work_order_id);

-- 4. Functions
-- Function to generate work order number
CREATE OR REPLACE FUNCTION public.generate_work_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    year_part TEXT := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    sequence_number INTEGER;
    order_number TEXT;
BEGIN
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 0) + 1
    INTO sequence_number
    FROM public.work_orders
    WHERE order_number LIKE year_part || '%';
    
    -- Format: YYYY0001, YYYY0002, etc.
    order_number := year_part || LPAD(sequence_number::TEXT, 4, '0');
    
    RETURN order_number;
END;
$func$;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number(invoice_type_param public.invoice_type)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    year_part TEXT := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    type_prefix TEXT;
    sequence_number INTEGER;
    invoice_number TEXT;
BEGIN
    -- Set prefix based on type
    IF invoice_type_param = 'invoice' THEN
        type_prefix := 'NF';
    ELSE
        type_prefix := 'RC';
    END IF;
    
    -- Get the next sequence number for this year and type
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM LENGTH(type_prefix || year_part) + 1) AS INTEGER)), 0) + 1
    INTO sequence_number
    FROM public.invoices
    WHERE invoice_number LIKE type_prefix || year_part || '%';
    
    -- Format: NF20250001, RC20250001, etc.
    invoice_number := type_prefix || year_part || LPAD(sequence_number::TEXT, 4, '0');
    
    RETURN invoice_number;
END;
$func$;

-- Function to update work order total
CREATE OR REPLACE FUNCTION public.update_work_order_total(work_order_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    services_total DECIMAL(10,2) := 0.00;
    parts_total DECIMAL(10,2) := 0.00;
    total_amount DECIMAL(10,2) := 0.00;
BEGIN
    -- Calculate services total
    SELECT COALESCE(SUM(total_price), 0.00)
    INTO services_total
    FROM public.work_order_services
    WHERE work_order_id = work_order_uuid;
    
    -- Calculate parts total
    SELECT COALESCE(SUM(total_price), 0.00)
    INTO parts_total
    FROM public.work_order_parts
    WHERE work_order_id = work_order_uuid;
    
    -- Update work order total
    total_amount := services_total + parts_total;
    
    UPDATE public.work_orders
    SET total_amount = total_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = work_order_uuid;
END;
$func$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'receptionist')::public.user_role
    );
    RETURN NEW;
END;
$func$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_history ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- User profiles - Pattern 1 (Core User Table)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Customers - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_customers"
ON public.customers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Vehicles - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_vehicles"
ON public.vehicles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Services - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_services"
ON public.services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Inventory items - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_inventory"
ON public.inventory_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Work orders - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_work_orders"
ON public.work_orders
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Work order services - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_work_order_services"
ON public.work_order_services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Work order parts - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_work_order_parts"
ON public.work_order_parts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Invoices - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_invoices"
ON public.invoices
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Work order history - All authenticated users can manage
CREATE POLICY "authenticated_users_manage_work_order_history"
ON public.work_order_history
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Triggers
-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    mechanic_uuid UUID := gen_random_uuid();
    customer1_id UUID := gen_random_uuid();
    customer2_id UUID := gen_random_uuid();
    vehicle1_id UUID := gen_random_uuid();
    vehicle2_id UUID := gen_random_uuid();
    service1_id UUID := gen_random_uuid();
    service2_id UUID := gen_random_uuid();
    part1_id UUID := gen_random_uuid();
    part2_id UUID := gen_random_uuid();
    wo1_id UUID := gen_random_uuid();
    wo2_id UUID := gen_random_uuid();
    wo3_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@workshop.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "João Silva", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (mechanic_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'mechanic@workshop.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Carlos Silva", "role": "mechanic"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create customers
    INSERT INTO public.customers (id, name, email, phone, address, document_number, created_by) VALUES
        (customer1_id, 'Maria Silva', 'maria.silva@email.com', '(11) 99999-1111', 'Rua das Flores, 123, São Paulo, SP', '123.456.789-00', admin_uuid),
        (customer2_id, 'João Santos', 'joao.santos@email.com', '(11) 99999-2222', 'Av. Paulista, 456, São Paulo, SP', '987.654.321-00', admin_uuid);

    -- Create vehicles
    INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate, color, mileage) VALUES
        (vehicle1_id, customer1_id, 'Honda', 'Civic', 2020, 'ABC-1234', 'Branco', 45000),
        (vehicle2_id, customer2_id, 'Toyota', 'Corolla', 2019, 'DEF-5678', 'Prata', 62000);

    -- Create services
    INSERT INTO public.services (id, name, description, price, estimated_hours) VALUES
        (service1_id, 'Revisão de Freios', 'Verificação completa do sistema de freios', 200.00, 2.0),
        (service2_id, 'Troca de Óleo', 'Troca de óleo do motor com filtro', 80.00, 0.5);

    -- Create inventory items
    INSERT INTO public.inventory_items (id, code, name, description, unit_price, quantity_in_stock) VALUES
        (part1_id, 'BRK001', 'Pastilha de Freio Dianteira', 'Pastilha de freio original', 120.00, 10),
        (part2_id, 'OIL001', 'Óleo Motor 5W30', 'Óleo sintético premium', 25.00, 50);

    -- Create work orders
    INSERT INTO public.work_orders (id, order_number, customer_id, vehicle_id, assigned_mechanic_id, created_by, status, problem_description, estimated_completion, total_amount) VALUES
        (wo1_id, '20250001', customer1_id, vehicle1_id, mechanic_uuid, admin_uuid, 'in_progress', 'Cliente relata ruído estranho nos freios e vibração no volante durante frenagem.', '2025-01-25', 850.00),
        (wo2_id, '20250002', customer2_id, vehicle2_id, mechanic_uuid, admin_uuid, 'pending', 'Troca de óleo e filtros conforme cronograma de manutenção preventiva.', '2025-01-24', 320.00),
        (wo3_id, '20250003', customer1_id, vehicle1_id, mechanic_uuid, admin_uuid, 'completed', 'Problema na suspensão dianteira resolvido.', '2025-01-23', 1200.00);

    -- Create work order services
    INSERT INTO public.work_order_services (work_order_id, service_id, quantity, unit_price, total_price) VALUES
        (wo1_id, service1_id, 1, 200.00, 200.00),
        (wo2_id, service2_id, 1, 80.00, 80.00);

    -- Create work order parts
    INSERT INTO public.work_order_parts (work_order_id, inventory_item_id, quantity, unit_price, total_price) VALUES
        (wo1_id, part1_id, 1, 120.00, 120.00),
        (wo2_id, part2_id, 4, 25.00, 100.00);

    -- Create work order history
    INSERT INTO public.work_order_history (work_order_id, action, description, performed_by) VALUES
        (wo1_id, 'OS Criada', 'Ordem de serviço criada no sistema', admin_uuid),
        (wo1_id, 'Mecânico Atribuído', 'Carlos Silva foi designado para esta OS', admin_uuid),
        (wo1_id, 'Iniciado', 'Trabalhos iniciados pelo mecânico', mechanic_uuid),
        (wo2_id, 'OS Criada', 'Ordem de serviço criada no sistema', admin_uuid),
        (wo2_id, 'Mecânico Atribuído', 'Carlos Silva foi designado para esta OS', admin_uuid),
        (wo3_id, 'OS Criada', 'Ordem de serviço criada no sistema', admin_uuid),
        (wo3_id, 'Iniciado', 'Trabalhos iniciados pelo mecânico', mechanic_uuid),
        (wo3_id, 'Concluído', 'Todos os serviços foram finalizados', mechanic_uuid);
END $$;