<?php
require_once '../config/database.php';

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $surname;
    public $first_name;
    public $middle_initial;
    public $email;
    public $contact;
    public $address;
    public $message;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    surname = :surname,
                    first_name = :first_name,
                    middle_initial = :middle_initial,
                    email = :email,
                    contact = :contact,
                    address = :address,
                    message = :message,
                    password = :password";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->surname = htmlspecialchars(strip_tags($this->surname));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->middle_initial = htmlspecialchars(strip_tags($this->middle_initial));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->contact = htmlspecialchars(strip_tags($this->contact));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->message = htmlspecialchars(strip_tags($this->message));
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);

        // Bind values
        $stmt->bindParam(":surname", $this->surname);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":middle_initial", $this->middle_initial);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":contact", $this->contact);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":message", $this->message);
        $stmt->bindParam(":password", $this->password);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function emailExists() {
        $query = "SELECT id, surname, first_name, middle_initial, email, contact, address, password
                FROM " . $this->table_name . "
                WHERE email = :email
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        $num = $stmt->rowCount();

        if ($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->surname = $row['surname'];
            $this->first_name = $row['first_name'];
            $this->middle_initial = $row['middle_initial'];
            $this->contact = $row['contact'];
            $this->address = $row['address'];
            $this->password = $row['password'];
            return true;
        }

        return false;
    }

    public function contactExists() {
        $query = "SELECT id FROM " . $this->table_name . "
                WHERE contact = :contact
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":contact", $this->contact);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function getUserById() {
        $query = "SELECT id, surname, first_name, middle_initial, email, contact, address, created_at
                FROM " . $this->table_name . "
                WHERE id = :id
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->surname = $row['surname'];
            $this->first_name = $row['first_name'];
            $this->middle_initial = $row['middle_initial'];
            $this->email = $row['email'];
            $this->contact = $row['contact'];
            $this->address = $row['address'];
            return true;
        }

        return false;
    }
}
?>
