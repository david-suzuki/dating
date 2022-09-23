import { httpService } from "./httpService";

export const getProjects = () => {
  return httpService.get("api/projects");
};

export const getProject = (id) => {
  return httpService.get("api/project/" + id);
};

export const getProjectFormats = () => {
  return httpService.get("api/work/formats");
};

export const setProjectStatus = ({ project_id, status }) => {
  return httpService.put("api/project/set-status", { project_id, status });
};

export const assignProject = ({ project_id, business_id }) => {
  return httpService.put("api/admin/project/assign", {
    project_id,
    business_id,
  });
};

export const deleteProject = ({ id }) => {
  return httpService.deleteDetail("api/admin/project/" + id + "/delete");
};

export const downloadOrder = (projectId) => {
  return httpService.download("api/project/order/download/" + projectId);
};

export const downloadInvoice = (projectId) => {
  return httpService.download("api/project/invoice/download/" + projectId);
};

export const getProjectRequestData = (projectId) => {
  return httpService.get("api/project/request/get/" + projectId);
};

export const getProjectDeliveryData = (projectId) => {
  return httpService.get("api/project/delivery/get/" + projectId);
};

export const downloadRequestData = (id) => {
  return httpService.download("api/project/request/download/" + id);
};

export const downloadDeliveryData = (id) => {
  return httpService.download("api/project/delivery/download/" + id);
};

export const uploadRequestData = (projectId, data) => {
  return httpService.upload("api/project/request/add/" + projectId, data);
};

export const uploadDeliveryData = (projectId, data) => {
  return httpService.upload("api/project/delivery/add/" + projectId, data);
};

export const deleteRequestData = (id) => {
  return httpService.deleteDetail("api/admin/project/request/delete/" + id);
};

export const deleteDeliveryData = (id) => {
  return httpService.deleteDetail("api/admin/project/delivery/delete/" + id);
};

export const createProject = ({
  client_id,
  admin_id,
  title,
  amount,
  subamount,
  tax,
  delivery_date,
  ground_data,
  ground_data_output,
  simplified_drawing,
  simplified_drawing_output,
  simplified_drawing_rank,
  simplified_drawing_scale,
  contour_data,
  contour_data_output,
  longitudinal_data,
  longitudinal_data_output,
  simple_orthphoto,
  simple_orthphoto_output,
  mesh_soil_volume,
  mesh_soil_volume_output,
  simple_accuracy_table,
  simple_accuracy_table_output,
  public_accuracy_table,
  public_accuracy_table_output,
  ground_price,
  simplified_drawing_price,
  contour_price,
  longitudinal_price,
  simple_orthphoto_price,
  mesh_soil_volume_price,
  simple_accuracy_price,
  public_accuracy_price,
}) => {
  return httpService.post("api/client/project/create", {
    client_id,
    admin_id,
    title,
    amount,
    subamount,
    tax,
    delivery_date,
    ground_data,
    ground_data_output,
    simplified_drawing,
    simplified_drawing_output,
    simplified_drawing_rank,
    simplified_drawing_scale,
    contour_data,
    contour_data_output,
    longitudinal_data,
    longitudinal_data_output,
    simple_orthphoto,
    simple_orthphoto_output,
    mesh_soil_volume,
    mesh_soil_volume_output,
    simple_accuracy_table,
    simple_accuracy_table_output,
    public_accuracy_table,
    public_accuracy_table_output,
    ground_price,
    simplified_drawing_price,
    contour_price,
    longitudinal_price,
    simple_orthphoto_price,
    mesh_soil_volume_price,
    simple_accuracy_price,
    public_accuracy_price,
  });
};
