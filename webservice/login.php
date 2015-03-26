<?php

include 'config.php';
header("content-type: application/json");

//id_user,nama_user,username,email,alamat,level,key
$sql_member = "SELECT id as id_user,
					  nama as nama_lengkap,
					  username,
					  email,
					  alamat,
					  level
				FROM member
				WHERE (username = :username AND  password = :password)";

$sql_user = "SELECT id as id_user,
					nama as nama_lengkap,
					username,
					email,
					alamat,
					level
			 FROM user
			 WHERE (username = :username AND  password = :password)";

				   
try {
	$data = "";
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$stmt = $dbh->prepare($sql_member);  
	$stmt->bindParam("username", $_GET['username']);
    $stmt->bindParam("password", $_GET['password']);    
	$stmt->execute();  
    
    if($stmt->fetchColumn() == 0){
		//sekarang cek user
	  
		$stmt = $dbh->prepare($sql_user);  
		$stmt->bindParam("username", $_GET['username']);
		$stmt->bindParam("password", $_GET['password']);    
		$stmt->execute();  
	  
		if($stmt->fetchColumn() == 0){
			
			echo json_encode(array("st" => 'not_found'));
			
		}else{
			$stmt->execute();
			$data = $stmt->fetchObject();
	  
			echo json_encode($data); 
		}
		
      
    }else{
		
		$stmt->execute();
		$data = $stmt->fetchObject();
	  
		echo json_encode($data); 
    }
	
	$dbh = null;
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}

?>