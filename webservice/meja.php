<?php

include 'config.php';


try {
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    $cmd = $_GET['cmd'];
    
	if($cmd === 'showlist'){		
		
		$sql = "SELECT id,nama,status
				FROM meja
                ORDER BY id ASC";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$meja = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($meja) . '}';
		
	}else if($cmd === 'update'){
		
		$sql = "UPDATE meja
				SET nama=:nama,status=:status
				WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
        $stmt->bindParam("nama", $_POST['nama']);
        $stmt->bindParam("status", $_POST['status']);        
		$stmt->execute();
				
	}else if($cmd === 'getbyid'){
		
        $sql = "SELECT nama,status
				FROM meja
                WHERE id = " .  $_GET['id'];

		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$user = $stmt->fetchObject();
		
		echo json_encode($user);
        
    }else if($cmd === 'delete'){
      
        $sql = "DELETE FROM meja WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
    }else if($cmd === 'insert'){
		
		$sql = "INSERT meja(nama,status)
				VALUES(:nama,:status)";
				
		$stmt = $dbh->prepare($sql);		
		$stmt->bindParam("nama", $_POST['nama']);
        $stmt->bindParam("status", $_POST['status']);   
		$stmt->execute();
		
	}else if($cmd === 'showlist-digunakan'){		
		
		$sql = "SELECT id,nama
				FROM meja
				WHERE status='Y'
                ORDER BY id ASC";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$meja = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($meja) . '}';
		
	}else if($cmd === 'showlist-digunakan-kosong'){		
		
		$sql = "SELECT id,nama
				FROM meja
				WHERE STATUS='Y' AND id NOT IN (
												SELECT id_meja FROM pesanan
												WHERE status <> 'selesai'
											   )
				ORDER BY id ASC";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$meja = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($meja) . '}';
		
	}else if($cmd === 'showlist-aktif'){
		$sql = "SELECT id,nama
				FROM meja
				WHERE STATUS='Y' AND id IN (
											SELECT id_meja FROM pesanan
											WHERE status <> 'selesai'
											)
				ORDER BY id ASC";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$meja = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($meja) . '}';
	}else if($cmd === 'ganti-meja'){
		
		$sql = "UPDATE pesanan
		        SET id_meja = :meja_baru
				WHERE status <> 'selesai' AND id_meja = :meja_awal
				";
		
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("meja_baru", $_GET['baru']);
        $stmt->bindParam("meja_awal", $_GET['awal']);        
		$stmt->execute();
	}else if($cmd === 'show-list-with-status'){
		$sql = "SELECT a.id,a.nama,IFNULL(b.status,'-') as status,b.id as id_pesanan
						FROM meja a
						LEFT JOIN (SELECT id,id_meja,status 
								   FROM pesanan b
								   WHERE status <> 'selesai') b ON a.id = b.id_meja
						WHERE a.STATUS='Y' 
						ORDER BY a.id ASC";
						
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  		
		$meja = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($meja) . '}';				
	}
	
	$dbh = null;
	
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}
