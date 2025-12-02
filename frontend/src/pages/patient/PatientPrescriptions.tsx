import { useEffect, useState } from "react";
import { Download, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { apiGet } from "@/api/client";

interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorName?: string;
  diagnosis: string;
  date: string;
  medicines: string[];
}

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: replace with logged-in patient's id from auth context
  const patientId = "1";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet<Prescription[]>(`/patients/${patientId}/prescriptions`);
        setPrescriptions(data);
      } catch (err) {
        console.error("Failed to load prescriptions", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const handleDownload = async (id: string) => {
    try {
      await apiGet(`/prescriptions/${id}/download`);
      alert(`Downloading prescription ${id}`);
    } catch (err) {
      console.error("Failed to download prescription", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar role="patient" />
        <main className="flex-1 p-8">Loading prescriptions...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="patient" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Prescriptions</h1>
          <p className="text-muted-foreground">View and download your prescriptions</p>
        </div>

        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Pill className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{prescription.diagnosis}</h3>
                    <p className="text-sm text-muted-foreground">
                      {prescription.doctorName || "Doctor"} •{" "}
                      {new Date(prescription.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(prescription._id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm font-medium text-foreground mb-2">Medicines:</p>
                <ul className="space-y-1">
                  {prescription.medicines.map((medicine, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {medicine}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {prescriptions.length === 0 && (
            <p className="text-muted-foreground">No prescriptions found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientPrescriptions;

