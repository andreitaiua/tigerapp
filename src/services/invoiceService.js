import { supabase } from '../lib/supabase';

class InvoiceService {
  async getInvoices() {
    try {
      const { data, error } = await supabase?.from('invoices')?.select(`
          *,
          customer:customers(*),
          work_order:work_orders(*),
          created_by_user:user_profiles!invoices_created_by_fkey(full_name)
        `)?.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Error fetching invoices:', error);
      throw error;
    }
  }

  async getInvoiceById(id) {
    try {
      const { data, error } = await supabase?.from('invoices')?.select(`
          *,
          customer:customers(*),
          work_order:work_orders(
            *,
            vehicle:vehicles(*),
            work_order_services(
              *,
              service:services(*)
            ),
            work_order_parts(
              *,
              inventory_item:inventory_items(*)
            )
          ),
          created_by_user:user_profiles!invoices_created_by_fkey(full_name)
        `)?.eq('id', id)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error fetching invoice:', error);
      throw error;
    }
  }

  async createInvoice(invoiceData) {
    try {
      // Generate invoice number
      const { data: invoiceNumber, error: numberError } = await supabase?.rpc('generate_invoice_number', {
          invoice_type_param: invoiceData?.invoice_type
        });

      if (numberError) throw numberError;

      const { data, error } = await supabase?.from('invoices')?.insert({
          invoice_number: invoiceNumber,
          ...invoiceData,
        })?.select(`
          *,
          customer:customers(*),
          work_order:work_orders(
            *,
            vehicle:vehicles(*),
            work_order_services(
              *,
              service:services(*)
            ),
            work_order_parts(
              *,
              inventory_item:inventory_items(*)
            )
          )
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error creating invoice:', error);
      throw error;
    }
  }

  async updateInvoice(id, updateData) {
    try {
      const { data, error } = await supabase?.from('invoices')?.update({
          ...updateData,
          updated_at: new Date()?.toISOString(),
        })?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error updating invoice:', error);
      throw error;
    }
  }

  async deleteInvoice(id) {
    try {
      const { error } = await supabase?.from('invoices')?.delete()?.eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.log('Error deleting invoice:', error);
      throw error;
    }
  }

  async getInvoicesByWorkOrder(workOrderId) {
    try {
      const { data, error } = await supabase?.from('invoices')?.select(`
          *,
          customer:customers(*),
          created_by_user:user_profiles!invoices_created_by_fkey(full_name)
        `)?.eq('work_order_id', workOrderId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Error fetching invoices by work order:', error);
      throw error;
    }
  }

  async markInvoiceAsPaid(id, paymentMethod, paymentDate = null) {
    try {
      const { data, error } = await supabase?.from('invoices')?.update({
          status: 'paid',
          payment_method: paymentMethod,
          paid_at: paymentDate || new Date()?.toISOString(),
          updated_at: new Date()?.toISOString(),
        })?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error marking invoice as paid:', error);
      throw error;
    }
  }
}

export const invoiceService = new InvoiceService();