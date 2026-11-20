
import DataPage from "../components/DataPage";

function Vendors() {
  const fields = [
    { name: "vendor_name", label: "Vendor Name" },
    { name: "phone_number", label: "Phone Number" },
    { name: "location", label: "Location" },
    { name: "registration_date", label: "Registration Date", type: "date" }
  ];

  const columns = [
    { key: "vendor_id", label: "Vendor ID" },
    { key: "vendor_name", label: "Vendor Name" },
    { key: "phone_number", label: "Phone Number" },
    { key: "location", label: "Location" },
    { key: "registration_date", label: "Registration Date" }
  ];

  return (
    <DataPage
      title="Vendors"
      endpoint="/vendors"
      fields={fields}
      columns={columns}
      idField="vendor_id"
    />
  );
}

export default Vendors;
