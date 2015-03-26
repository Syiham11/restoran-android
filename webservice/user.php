<?php

include 'config.php';


try {
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    $cmd = $_GET['cmd'];
    
	if($cmd === 'showlist'){		
		
		$sql = "SELECT id,username,nama,email,alamat,level
				FROM user
                ORDER BY id ASC";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($users) . '}';
		
	}else if($cmd === 'update'){
		
		if(isset($_POST['username'])){

			$sql = "UPDATE user
					SET username=:username,nama=:nama,email=:email,alamat=:alamat,level=:level
					WHERE id = :id";

			$stmt = $dbh->prepare($sql);  		
			$stmt->bindParam("id", $_GET['id']);
			$stmt->bindParam("username", $_POST['username']);
			$stmt->bindParam("nama", $_POST['nama']);
			$stmt->bindParam("email", $_POST['email']);
			$stmt->bindParam("alamat", $_POST['alamat']);
			$stmt->bindParam("level", $_POST['level']);
			
		}else{
			
			$sql = "UPDATE user
					SET nama=:nama,email=:email,alamat=:alamat
					WHERE id = :id";
			$stmt = $dbh->prepare($sql);  		
			$stmt->bindParam("id", $_GET['id']);			
			$stmt->bindParam("nama", $_POST['nama']);
			$stmt->bindParam("email", $_POST['email']);
			$stmt->bindParam("alamat", $_POST['alamat']);
			
		}
		
        
		$stmt->execute();
				
	}else if($cmd === 'getbyid'){
		
        $sql = "SELECT username,nama,email,alamat,level
				FROM user
                WHERE id = " .  $_GET['id'];

		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$user = $stmt->fetchObject();
		
		echo json_encode($user);
        
    }else if($cmd === 'delete'){
      
        $sql = "DELETE FROM user WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
    }else if($cmd === 'insert'){
		
		$sql = "INSERT user(username,password,nama,email,alamat,level)
				VALUES(:username,:password,:nama,:email,:alamat,:level)";
				
		$stmt = $dbh->prepare($sql);
		$stmt->bindParam("username", $_POST['username']);
		$stmt->bindParam("password", md5($_POST['username']));
		$stmt->bindParam("nama", $_POST['nama']);
        $stmt->bindParam("email", $_POST['email']);
        $stmt->bindParam("alamat", $_POST['alamat']);
		$stmt->bindParam("level", $_POST['level']);        
		$stmt->execute();		
	}
	
	$dbh = null;
	
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}
