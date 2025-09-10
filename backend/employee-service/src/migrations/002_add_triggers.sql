CREATE OR REPLACE FUNCTION update_child_records_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If employee is inactive, remove roles and reporting relationships
  IF NEW.employee_status = FALSE THEN
    UPDATE employee_roles SET role_id = NULL WHERE employee_id = NEW.id;
    UPDATE employee_hierarchy SET reporting_to_id = NULL WHERE employee_id = NEW.id;
  END IF;
  

  INSERT INTO employee_roles_history (employee_id, role_id, changed_at)
  SELECT employee_id, role_id, NOW() FROM employee_roles WHERE employee_id = NEW.id;
  
  INSERT INTO employee_hierarchy_history (employee_id, reporting_to_id, changed_at)
  SELECT employee_id, reporting_to_id, NOW() FROM employee_hierarchy WHERE employee_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger on employee status update
CREATE TRIGGER trg_update_child_on_status_change
AFTER UPDATE OF employee_status ON employees
FOR EACH ROW EXECUTE FUNCTION update_child_records_on_status_change();
