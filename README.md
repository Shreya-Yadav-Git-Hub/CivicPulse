# CivicPulse — Civic Issue Reporting Platform

CivicPulse is a student mini project for **Data Structures using Java**. It demonstrates how civic complaints can be registered, assigned a priority, mapped to a department, searched, sorted, and tracked through status updates.

## Project contents

- `website/` — browser-based demo interface (HTML, CSS, JavaScript)
- `java/CivicPulse.java` — console-based Java implementation for Data Structures viva

## Features

- Register civic issues and enter location, severity, and number of people affected
- Calculate priority as `severity × people affected`
- Map common issue types to departments
- Search complaints and update their status
- Sort complaints from highest to lowest priority
- Dashboard counters and search on the website

## Run the website

1. Download or extract this repository.
2. Open `website/index.html` in Chrome, Edge, or Firefox.
3. Submit a test complaint and try the search, sort, and status controls.

The website is a front-end demonstration. It saves data in the browser's local storage, so data is local to that browser and is not sent to a real municipality. The website JavaScript and Java console program are separate implementations; they are not connected to one another.

## Run the Java program

You need a Java JDK installed.

1. Open a terminal in the `java` folder.
2. Compile:

   ```bash
   javac CivicPulse.java
   ```

3. Run:

   ```bash
   java CivicPulse
   ```

You can also paste `CivicPulse.java` into an online Java compiler. Use the class name `CivicPulse`.

## Data Structures and algorithms

| Concept | Use in CivicPulse |
|---|---|
| Class and objects | Each `Complaint` object stores one report |
| `ArrayList<Complaint>` | Stores and traverses complaint records |
| `HashMap<String, String>` | Maps an issue type to a department |
| Linear search | Finds a complaint by ID |
| Selection sort | Sorts complaints by priority, highest first |
| Priority formula | `severity × peopleAffected` |

### Complexity

- Linear search by ID: `O(n)`
- Selection sort: `O(n²)`
- HashMap department lookup: average `O(1)`
- Highest-priority scan: `O(n)`

## Publish the website using GitHub Pages

1. Sign in to GitHub and create a new **public** repository called `CivicPulse`.
2. Upload the contents of this project folder. Keep the `website` and `java` folders and `README.md`.
3. In the repository, open **Settings → Pages**.
4. Under the build/deployment section, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)` only if you put `index.html` in the repository root.

   **Important:** In this project the website's `index.html` is inside `website/`. GitHub Pages normally serves the selected folder, not a nested folder. The easiest option is to upload the *contents of the `website` folder* into the repository root, and keep the Java file in a separate `java` folder (or retain a copy in `java/`).

6. Save and wait for the deployment link to appear in Settings → Pages.

If you keep the exact folder structure unchanged, you can instead deploy through a GitHub Actions workflow that publishes the `website/` folder. For a beginner, copying the website files to the repository root is simpler.

## Limitations and future scope

- Data is stored locally in the browser, not in a shared database.
- No real municipality or department is connected.
- A future version could use a Java backend and a database so multiple users can submit and view the same complaints.

## Academic note

This is an educational prototype, not a real public reporting service. Use sample data for demonstrations and do not enter private personal information.
