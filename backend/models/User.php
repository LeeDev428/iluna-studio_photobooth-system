<?php
// No need to require database.php here as it's already included in the calling file

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $email;
    public $contact;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name = :name,
                    email = :email,
                    contact = :contact,
                    password = :password";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->contact = htmlspecialchars(strip_tags($this->contact));
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":contact", $this->contact);
        $stmt->bindParam(":password", $this->password);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function emailExists() {
        $query = "SELECT id, name, email, contact, password
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
            $this->name = $row['name'];
            $this->contact = $row['contact'];
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
        $query = "SELECT id, name, email, contact, created_at
                FROM " . $this->table_name . "
                WHERE id = :id
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->contact = $row['contact'];
            return true;
        }

        return false;
    }
}
?>
