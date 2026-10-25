import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class CivicPulse {

    // One object represents one civic complaint.
    static class Complaint {
        int id;
        String name, type, location, status;
        int severity, peopleAffected, priority;

        Complaint(int id, String name, String type, String location,
                  int severity, int peopleAffected) {
            this.id = id;
            this.name = name;
            this.type = type;
            this.location = location;
            this.severity = severity;
            this.peopleAffected = peopleAffected;
            this.priority = severity * peopleAffected;
            this.status = "Registered";
        }

        void display() {
            System.out.println("\\nComplaint ID: " + id);
            System.out.println("Citizen: " + name);
            System.out.println("Issue: " + type);
            System.out.println("Location: " + location);
            System.out.println("Severity: " + severity);
            System.out.println("People affected: " + peopleAffected);
            System.out.println("Priority score: " + priority);
            System.out.println("Status: " + status);
            System.out.println("--------------------------------");
        }
    }

    // ArrayList stores complaint objects.
    static ArrayList<Complaint> complaints = new ArrayList<>();

    // HashMap connects issue types to responsible departments.
    static HashMap<String, String> departments = new HashMap<>();

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        setupDepartments();

        int choice;
        do {
            System.out.println("\\n====== CIVICPULSE ======");
            System.out.println("1. Register complaint");
            System.out.println("2. View all complaints");
            System.out.println("3. Find department");
            System.out.println("4. View highest priority");
            System.out.println("5. Update status");
            System.out.println("6. Search complaint by ID");
            System.out.println("7. Sort by priority");
            System.out.println("8. Exit");
            System.out.print("Enter choice: ");
            choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {
                case 1: addComplaint(sc); break;
                case 2: viewComplaints(); break;
                case 3: findDepartment(sc); break;
                case 4: highestPriority(); break;
                case 5: updateStatus(sc); break;
                case 6: searchComplaint(sc); break;
                case 7: sortComplaints(); break;
                case 8: System.out.println("Thank you for using CivicPulse!"); break;
                default: System.out.println("Invalid choice.");
            }
        } while (choice != 8);

        sc.close();
    }

    static void setupDepartments() {
        departments.put("pothole", "Road Department");
        departments.put("road", "Road Department");
        departments.put("water", "Water Department");
        departments.put("leakage", "Water Department");
        departments.put("garbage", "Waste Department");
        departments.put("waste", "Waste Department");
        departments.put("streetlight", "Electrical Department");
        departments.put("drainage", "Drainage Department");
    }

    static void addComplaint(Scanner sc) {
        System.out.print("Enter complaint ID: ");
        int id = sc.nextInt();
        sc.nextLine();

        if (findById(id) != null) {
            System.out.println("That ID already exists.");
            return;
        }

        System.out.print("Enter citizen name: ");
        String name = sc.nextLine();
        System.out.print("Enter issue type (pothole/water/garbage/streetlight/drainage): ");
        String type = sc.nextLine().toLowerCase().trim();
        System.out.print("Enter location: ");
        String location = sc.nextLine();
        System.out.print("Enter severity (1-5): ");
        int severity = sc.nextInt();
        System.out.print("Enter people affected: ");
        int people = sc.nextInt();
        sc.nextLine();

        if (severity < 1 || severity > 5 || people < 1) {
            System.out.println("Invalid severity or people count.");
            return;
        }

        Complaint c = new Complaint(id, name, type, location, severity, people);
        complaints.add(c);

        System.out.println("Complaint registered successfully.");
        System.out.println("Priority score: " + c.priority);
        String department = departments.get(type);
        System.out.println("Department: " +
                (department == null ? "Manual assignment required" : department));
    }

    static void viewComplaints() {
        if (complaints.isEmpty()) {
            System.out.println("No complaints available.");
            return;
        }
        for (Complaint c : complaints) {
            c.display();
        }
    }

    static void findDepartment(Scanner sc) {
        System.out.print("Enter issue type: ");
        String type = sc.nextLine().toLowerCase().trim();
        String department = departments.get(type);

        if (department == null) {
            System.out.println("Department not found; manual assignment required.");
        } else {
            System.out.println("Responsible department: " + department);
        }
    }

    // Linear search: check each complaint until its ID matches.
    static Complaint findById(int id) {
        for (Complaint c : complaints) {
            if (c.id == id) {
                return c;
            }
        }
        return null;
    }

    static void highestPriority() {
        if (complaints.isEmpty()) {
            System.out.println("No complaints available.");
            return;
        }

        Complaint highest = complaints.get(0);
        for (Complaint c : complaints) {
            if (c.priority > highest.priority) {
                highest = c;
            }
        }

        System.out.println("Complaint with the highest priority:");
        highest.display();
    }

    static void updateStatus(Scanner sc) {
        System.out.print("Enter complaint ID: ");
        int id = sc.nextInt();
        sc.nextLine();

        Complaint c = findById(id);
        if (c == null) {
            System.out.println("Complaint not found.");
            return;
        }

        System.out.println("1. Acknowledged");
        System.out.println("2. In Progress");
        System.out.println("3. Resolved");
        System.out.println("4. Verified by Citizen");
        System.out.print("Choose status: ");
        int choice = sc.nextInt();
        sc.nextLine();

        switch (choice) {
            case 1: c.status = "Acknowledged"; break;
            case 2: c.status = "In Progress"; break;
            case 3: c.status = "Resolved"; break;
            case 4: c.status = "Verified by Citizen"; break;
            default:
                System.out.println("Invalid status choice.");
                return;
        }
        System.out.println("Status updated to: " + c.status);
    }

    static void searchComplaint(Scanner sc) {
        System.out.print("Enter complaint ID: ");
        int id = sc.nextInt();
        sc.nextLine();

        Complaint c = findById(id);
        if (c == null) {
            System.out.println("Complaint not found.");
        } else {
            c.display();
        }
    }

    // Selection sort: repeatedly place the highest remaining priority first.
    static void sortComplaints() {
        if (complaints.isEmpty()) {
            System.out.println("No complaints available.");
            return;
        }

        int n = complaints.size();
        for (int i = 0; i < n - 1; i++) {
            int highestIndex = i;

            for (int j = i + 1; j < n; j++) {
                if (complaints.get(j).priority >
                    complaints.get(highestIndex).priority) {
                    highestIndex = j;
                }
            }

            Complaint temp = complaints.get(i);
            complaints.set(i, complaints.get(highestIndex));
            complaints.set(highestIndex, temp);
        }

        System.out.println("Complaints sorted by priority (highest first):");
        viewComplaints();
    }
}
