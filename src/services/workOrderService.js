import { supabase } from '../lib/supabase';

class WorkOrderService {
  async getWorkOrders() {
    try {
      const { data, error } = await supabase?.from('work_orders')?.select(`
          *,
          customer:customers(*),
          vehicle:vehicles(*),
          assigned_mechanic:user_profiles!work_orders_assigned_mechanic_id_fkey(full_name),
          created_by_user:user_profiles!work_orders_created_by_fkey(full_name),
          work_order_services(
            *,
            service:services(*)
          ),
          work_order_parts(
            *,
            inventory_item:inventory_items(*)
          ),
          work_order_history(
            *,
            performed_by_user:user_profiles!work_order_history_performed_by_fkey(full_name)
          )
        `)?.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Error fetching work orders:', error);
      throw error;
    }
  }

  async getWorkOrderById(id) {
    try {
      const { data, error } = await supabase?.from('work_orders')?.select(`
          *,
          customer:customers(*),
          vehicle:vehicles(*),
          assigned_mechanic:user_profiles!work_orders_assigned_mechanic_id_fkey(full_name),
          created_by_user:user_profiles!work_orders_created_by_fkey(full_name),
          work_order_services(
            *,
            service:services(*)
          ),
          work_order_parts(
            *,
            inventory_item:inventory_items(*)
          ),
          work_order_history(
            *,
            performed_by_user:user_profiles!work_order_history_performed_by_fkey(full_name)
          )
        `)?.eq('id', id)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error fetching work order:', error);
      throw error;
    }
  }

  async createWorkOrder(workOrderData) {
    try {
      // Generate work order number
      const { data: orderNumber, error: numberError } = await supabase?.rpc('generate_work_order_number');

      if (numberError) throw numberError;

      const { data, error } = await supabase?.from('work_orders')?.insert({
          order_number: orderNumber,
          ...workOrderData,
        })?.select()?.single();

      if (error) throw error;

      // Add history entry
      if (data?.id) {
        await this.addHistoryEntry(data?.id, 'OS Criada', 'Ordem de serviço criada no sistema');
      }

      return data;
    } catch (error) {
      console.log('Error creating work order:', error);
      throw error;
    }
  }

  async updateWorkOrder(id, updateData) {
    try {
      const { data, error } = await supabase?.from('work_orders')?.update({
          ...updateData,
          updated_at: new Date()?.toISOString(),
        })?.eq('id', id)?.select()?.single();

      if (error) throw error;

      // Add history entry for status change
      if (updateData?.status) {
        await this.addHistoryEntry(id, 'Status Atualizado', `Status alterado para: ${updateData?.status}`);
      }

      return data;
    } catch (error) {
      console.log('Error updating work order:', error);
      throw error;
    }
  }

  async deleteWorkOrder(id) {
    try {
      const { error } = await supabase?.from('work_orders')?.delete()?.eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.log('Error deleting work order:', error);
      throw error;
    }
  }

  async addHistoryEntry(workOrderId, action, description) {
    try {
      const { error } = await supabase?.from('work_order_history')?.insert({
          work_order_id: workOrderId,
          action,
          description,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.log('Error adding history entry:', error);
      throw error;
    }
  }

  async updateWorkOrderTotal(workOrderId) {
    try {
      const { error } = await supabase?.rpc('update_work_order_total', {
          work_order_uuid: workOrderId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.log('Error updating work order total:', error);
      throw error;
    }
  }
}

export const workOrderService = new WorkOrderService();