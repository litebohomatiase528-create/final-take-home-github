
import DataPage from "../components/DataPage";

const provinces = [
  "Gauteng",
  "Free State",
  "KwaZulu-Natal",
  "Western Cape",
  "Eastern Cape",
  "Limpopo",
  "Mpumalanga",
  "North West"
];

function Suppliers() {
  const fields = [
    { name: "business_name", label: "Business Name" },
    { name: "contact_person", label: "Contact Person" },
    { name: "phone", label: "Phone Number" },
    { name: "province", label: "Province", options: provinces },
    { name: "address", label: "Address" }
  ];

  const columns = [
    { key: "supplier_id", label: "Supplier ID" },
    { key: "business_name", label: "Business Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "province", label: "Province" },
    { key: "address", label: "Address" }
  ];

  return (
    <DataPage
      title="Suppliers"
      endpoint="/suppliers"
      fields={fields}
      columns={columns}
      idField="supplier_id"
    />
  );
}

export default Suppliers;
