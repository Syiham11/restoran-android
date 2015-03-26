<?php

include 'config.php';


try {
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    $cmd = $_GET['cmd'];
    
	if($cmd === 'showlist'){		
		
		$sql = "SELECT id,nama
				FROM region
                ORDER BY id ASC";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($users) . '}';
		
	}else if($cmd === 'update'){
		
		$sql = "UPDATE region
				SET nama=:nama
				WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
        $stmt->bindParam("nama", $_POST['nama']);       
        
		$stmt->execute();
				
	}else if($cmd === 'getbyid'){
		
        $sql = "SELECT nama
				FROM region
                WHERE id = " .  $_GET['id'];

		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$region = $stmt->fetchObject();
		
		echo json_encode($region);
        
    }else if($cmd === 'delete'){
      
        $sql = "DELETE FROM region WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
    }else if($cmd === 'insert'){
		
		$sql = "INSERT region(nama)
				VALUES(:nama)";
				
		$stmt = $dbh->prepare($sql);		
		$stmt->bindParam("nama", $_POST['nama']);        
		$stmt->execute();		
	}
	
	$dbh = null;
	
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}
