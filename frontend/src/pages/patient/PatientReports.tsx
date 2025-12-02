import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiGet } from "@/api/client";

interface Report {
  _id: string;
  name: string;
  type: string;
  doctor: string;
  date: string;
  patientId: string;
}

const PatientReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: replace with logged-in patient's id from auth context
  const patientId = "1";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet<Report[]>(`/patients/${patientId}/reports`);
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const handleDownload = async (id: string) => {
    try {
      await apiGet(`/reports/${id}/download`);
      alert(`Downloading report ${id}`);
    } catch (err) {
      console.error("Failed to download report", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar role="patient" />
        <main className="flex-1 p-8">Loading reports...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="patient" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Medical Reports</h1>
          <p className="text-muted-foreground">
            Download your medical reports and test results
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">{report.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm">
                      {report.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{report.doctor}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(report.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(report._id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default PatientReports;
