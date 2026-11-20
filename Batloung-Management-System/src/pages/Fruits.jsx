
import DataPage from "../components/DataPage";

function Fruits() {
  const fields = [
    { name: "fruit_name", label: "Fruit Name" },
    { name: "description", label: "Description" },
    {
      name: "status",
      label: "Status",
      options: ["Available", "Unavailable"]
    }
  ];

  const columns = [
    { key: "fruit_id", label: "Fruit ID" },
    { key: "fruit_name", label: "Fruit Name" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" }
  ];

  return (
    <DataPage
      title="Fruits"
      endpoint="/fruits"
      fields={fields}
      columns={columns}
      idField="fruit_id"
    />
  );
}

export default Fruits;
