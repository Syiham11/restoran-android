<?php

include 'config.php';


try {
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    $cmd = $_GET['cmd'];
    $jenis = isset($_GET['jenis']) ? $_GET['jenis'] : '';
    
	if($cmd === 'showlist'){		
		
		$sql = "SELECT id,nama,harga,diskon,gambar,status,habis
                FROM paket
                WHERE jenis = '" . $jenis . "' ORDER BY nama";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$paket = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($paket) . '}';
		
	}else if($cmd === 'update'){
		
		$sql = "UPDATE paket
				SET nama=:nama,
                    harga=:harga,
                    jenis=:jenis,
                    diskon=:diskon,
                    status=:status
				WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);        
        $stmt->bindParam("nama", $_POST['nama']);
        $stmt->bindParam("jenis", $_POST['jenis']);
        $stmt->bindParam("harga", $_POST['harga']);
        $stmt->bindParam("diskon", $_POST['diskon']);
        $stmt->bindParam("status", $_POST['status']);
		$stmt->execute();
				
	}else if($cmd === 'getbyid'){
		
        $sql = "SELECT nama,harga,jenis,diskon,status
				FROM paket
                WHERE id = " .  $_GET['id'];

		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$paket = $stmt->fetchObject();
		
		echo json_encode($paket);
        
    }else if($cmd === 'delete'){
      
        $sql = "DELETE FROM paket WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
    }else if($cmd === 'insert'){
		
		$sql = "INSERT paket(nama,jenis,harga,diskon,status)
				VALUES(:nama,:jenis,:harga,:diskon,:status)";
				
		$stmt = $dbh->prepare($sql);				
		$stmt->bindParam("nama", $_POST['nama']);
        $stmt->bindParam("jenis", $_POST['jenis']);
        $stmt->bindParam("harga", $_POST['harga']);
		$stmt->bindParam("diskon", $_POST['diskon']);
        $stmt->bindParam("status", $_POST['status']);
		$stmt->execute();
		
	}else if($cmd === 'update-habis'){
		
		$sql = "UPDATE paket set habis=:habis
				WHERE id=:id";
				
		$stmt = $dbh->prepare($sql);				
		$stmt->bindParam("habis", $_GET['habis']);        
        $stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
	}else if($cmd === 'reset-habis'){
		
		//reset semua paket habis ke N
		
		$sql = "UPDATE paket set habis='N'";
		$stmt = $dbh->query($sql);
		
	}else if($cmd === 'showlistnothabis'){
		//tampilkan semua paket dengan jenis tertentu yang tersedia
		$sql = "SELECT id,nama,harga,diskon,gambar,status,habis
                FROM paket
                WHERE habis = 'N' AND
					  status = 'Y' AND
					  id NOT IN(" . $_GET['not_in'] . ")
				ORDER BY nama";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($users) . '}';
		
	}else if($cmd === 'get-max-created_at'){
		
		$sql = "SELECT MAX(last_update) AS last_update
				FROM paket";
        
		$stmt = $dbh->prepare($sql);
		$stmt->execute();
		$result = $stmt -> fetch();
		
		$last_update = $result['last_update'];
        
        echo json_encode(array('last_update'=>$last_update));
		
	}else if($cmd === 'showlistnothabis-editmode'){
		$sql = "SELECT id,nama,harga,diskon,gambar,status,habis
				FROM paket
				WHERE habis = 'N' AND
						status = 'Y' AND
						id NOT IN(SELECT id_paket FROM pesanan_details
								 WHERE id_pesanan = " . $_GET['id_pesanan'] . " AND status = 'pending')
				ORDER BY nama";
				
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($users) . '}';		
	}
	
	
	$dbh = null;
	
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}
