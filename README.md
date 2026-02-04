# 📝 Exam Management System (Angular 21 & Firebase)

A modern, high-performance exam management platform built with the latest **Angular v21.1.2** features. This project focuses on high reactivity, optimized performance, and a seamless user experience using a Signal-based architecture.

## 🚀 Key Features

* **Doctor Dashboard:** Complete CRUD operations (Create, Read, Update, Delete) for managing exams and interactive question banks.
* **Student Dashboard:** Intuitive interface for browsing available exams and attempting tests.
* **Real-time Exam Engine:** Features a persistent, Signal-based countdown timer that maintains state even after page reloads.
* **Dynamic Validations:** Real-time form validation with user-friendly error messaging.
* **Responsive UI:** Fully optimized for all screen sizes using Bootstrap 5 and modern CSS techniques.

## 🛠 Tech Stack

* **Framework:** Angular v21.1.2 (Standalone Components Architecture).
* **State Management:** Angular Signals (Fine-grained reactivity).
* **Backend & Database:** Firebase Firestore.
* **Reactive Logic:** RxJS for asynchronous data streams.
* **UI/UX Enhancements:** * **SweetAlert2:** For professional confirmation and feedback dialogs.
    * **ngx-toastr:** For real-time, non-blocking notifications.
    * **Bootstrap 5:** For a clean and responsive layout.

## 💡 Technical Implementation Details

* **Signals Mastery:** Integrated Angular Signals to handle state across the application, significantly reducing change detection overhead.
* **Signal-based Forms:** Implemented advanced form logic using signals to provide immediate feedback and clean data flow.
* **Firebase Integration:** Robust service layer to handle real-time data synchronization between the frontend and Firebase backend.
* **Optimized Performance:** Developed with a focus on a "Zone-less" future, prioritizing signals and computed values over traditional heavy patterns.

## 🏗 Getting Started

1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/rewanabdelaziz/Exam-Management-System.git](https://github.com/rewanabdelaziz/Exam-Management-System.git)
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    ng serve
    ```
4.  **View the App:**
    Navigate to `http://localhost:4200/`

---

**Live Demo:** [https://rewanabdelaziz.github.io/Exam-Management-System/]