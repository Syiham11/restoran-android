<?php

include 'config.php';


try {
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	if($_GET['cmd'] === 'showlist'){
		
		
		$sql = "SELECT id,title, tipe, content_setting
				FROM settings";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$settings = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($settings) . '}';
		
	}else if($_GET['cmd'] === 'update'){
		
		$sql = "UPDATE settings
				SET content_setting = :content_setting        
				WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  
		$stmt->bindParam("content_setting", $_GET['content_setting']);
		$stmt->bindParam("id", $_GET['id']);    
		$stmt->execute(); 		
				
	}
	
	$dbh = null;
	
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}
