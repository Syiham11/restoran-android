<?php

include 'config.php';


try {
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    $cmd = $_GET['cmd'];
    
	if($cmd == 'get-last-deposit-by-id'){
		
		header("content-type: application/json");		
		$sql = "SELECT a.id,a.nama,a.password, 
						IFNULL(b.deposit - IFNULL(SUM(d.total_harga),0),0) AS sisa_deposit
			   FROM member a
			   LEFT JOIN (SELECT id_member,SUM(deposit) as deposit
							 FROM member_saldo
						  GROUP BY id_member) b ON a.id = b.id_member
			   LEFT JOIN pesanan c ON a.id = c.id_member
			   LEFT JOIN (
							   SELECT b.id_pesanan, a.id_member,
										SUM(b.harga * b.jumlah) - SUM(b.harga * b.jumlah * (b.diskon/100)) AS total_harga
							   FROM pesanan a
							   LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
							   WHERE a.status = 'selesai'
							   GROUP BY a.id
							   ) d ON c.id = d.id_pesanan AND d.id_member = b.id_member		
			   WHERE a.id = '" . $_GET['id']. "'		
			   GROUP BY a.id";
		
		$stmt = $dbh->query($sql);  		
		$member = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($member) . '}';
		
	}else if($cmd === 'showlist-by-password'){
		
		header("content-type: application/json");		
		$sql = "SELECT a.id,a.nama,a.password, 
						IFNULL(b.deposit - IFNULL(SUM(d.total_harga),0),0) AS sisa_deposit
			   FROM member a
			   LEFT JOIN (SELECT id_member,SUM(deposit) as deposit
							 FROM member_saldo
						  GROUP BY id_member) b ON a.id = b.id_member
			   LEFT JOIN pesanan c ON a.id = c.id_member
			   LEFT JOIN (
							   SELECT b.id_pesanan, a.id_member,
										SUM(b.harga * b.jumlah) - SUM(b.harga * b.jumlah * (b.diskon/100)) AS total_harga
							   FROM pesanan a
							   LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
							   WHERE a.status = 'selesai'
							   GROUP BY a.id
							   ) d ON c.id = d.id_pesanan AND d.id_member = b.id_member		
			   WHERE a.password = '" . $_GET['password']. "'		
			   GROUP BY a.id";
		
		$stmt = $dbh->query($sql);  		
		$member = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($member) . '}';
	
	}/*else if($cmd === 'get-last-deposit'){
		
		header("content-type: application/json");		
		$sql = "SELECT IFNULL((SUM(b.deposit) - IFNULL(d.total_harga,0)),0) AS sisa_deposit
                FROM member a
                LEFT JOIN member_saldo b ON a.id = b.id_member
                LEFT JOIN pesanan c ON a.id = c.id_member
                LEFT JOIN (SELECT id_pesanan,SUM(harga * jumlah) - SUM(harga * jumlah * (diskon/100)) as total_harga 
                           FROM pesanan_details ) d ON c.id = d.id_pesanan
				WHERE a.password= '" . $_GET['password'] ."' GROUP BY a.id";        
		
		$stmt = $dbh->prepare($sql);
		$stmt->execute();
		$result = $stmt -> fetch();
		
		$sisa_deposit = $result['sisa_deposit'];
        
        echo json_encode(array('sisa_deposit'=>$sisa_deposit));
		
	}*/else if($cmd === 'showlist'){		
		
		$sql = "SELECT a.id,a.nama,a.password, 
						IFNULL(b.deposit - IFNULL(SUM(d.total_harga),0),0) AS sisa_deposit
			   FROM member a
			   LEFT JOIN (SELECT id_member,SUM(deposit) as deposit
							 FROM member_saldo
						  GROUP BY id_member) b ON a.id = b.id_member
			   LEFT JOIN pesanan c ON a.id = c.id_member
			   LEFT JOIN (
							   SELECT b.id_pesanan, a.id_member,
										SUM(b.harga * b.jumlah) - SUM(b.harga * b.jumlah * (b.diskon/100)) AS total_harga
							   FROM pesanan a
							   LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
							   WHERE a.status = 'selesai'
							   GROUP BY a.id
							   ) d ON c.id = d.id_pesanan AND d.id_member = b.id_member		
				WHERE a.id <> 0		
			   GROUP BY a.id";
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$member = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($member) . '}';
		
	}else if($cmd === 'update'){
		
		$sql = "UPDATE member
				SET password=:password,
					nama=:nama,
					email=:email,
					alamat=:alamat,
					id_region=:id_region
				WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
        $stmt->bindParam("password", $_POST['id_card']);
        $stmt->bindParam("nama", $_POST['nama']);
        $stmt->bindParam("email", $_POST['email']);
        $stmt->bindParam("alamat", $_POST['alamat']);
        $stmt->bindParam("id_region", $_POST['id_region']);
        
		$stmt->execute();
				
	}else if($cmd === 'getbyid'){
		
        $sql = "SELECT password,
					   nama,
					   email,
					   alamat,
					   id_region
				FROM member
                WHERE id = " .  $_GET['id'];

		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$member = $stmt->fetchObject();
		
		echo json_encode($member);
        
    }else if($cmd === 'delete'){
		
		//delete pesanan_details
		$sql = "SELECT b.id
				FROM pesanan a
				LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
				WHERE a.id_member = " . $_GET['id'];
		
		$stmt = $dbh->query($sql);  		
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

		foreach($results as $row) {
			
			$id = $row['id'];			
			
			$sql = "DELETE FROM pesanan_details WHERE id = :id";
					
			$stmt = $dbh->prepare($sql);  		
			$stmt->bindParam("id", $id);
			$stmt->execute();
		}
		
		//delete pesanan
		$sql = "DELETE FROM pesanan WHERE id_member = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
		//delete member
        $sql = "DELETE FROM member WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
		//delete member_saldo
		$sql = "DELETE FROM member_saldo WHERE id_member = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
		
    }else if($cmd === 'insert'){
		
		$sql = "INSERT member(password,nama,email,alamat,id_region)
				VALUES(:password,:nama,:email,:alamat,:id_region)";
				
		$stmt = $dbh->prepare($sql);		
		$stmt->bindParam("password", $_POST['id_card']);
		$stmt->bindParam("nama", $_POST['nama']);
        $stmt->bindParam("email", $_POST['email']);
        $stmt->bindParam("alamat", $_POST['alamat']);
		$stmt->bindParam("id_region", $_POST['id_region']);        
		$stmt->execute();
		
	}else if($cmd === 'list-deposit'){
		
		$sql = "SELECT id,created_at,deposit
				FROM member_saldo
				WHERE id_member = " . $_GET['id_member'] . " ORDER BY last_update ASC ";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$deposit_list = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($deposit_list) . '}';
		
	}else if($cmd === 'update-deposit'){
		
		$sql = "UPDATE member_saldo
				SET deposit = :deposit        
				WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  
		$stmt->bindParam("deposit", $_GET['deposit']);
		$stmt->bindParam("id", $_GET['id']);    
		$stmt->execute();
		
	}else if($cmd === 'insert-deposit'){
		
		$sql = "INSERT member_saldo(id_member,deposit,created_at)
				VALUES(:id_member,:deposit,:created_at)";
				
		$stmt = $dbh->prepare($sql);		
		$stmt->bindParam("id_member", $_GET['id_member']);
		$stmt->bindParam("deposit", $_GET['deposit']);
        $stmt->bindParam("created_at", date('Y-m-d H:i:s'));
        
		$stmt->execute();
		
	}else if($cmd === 'delete_deposit'){
      
        $sql = "DELETE FROM member_saldo WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();		
    }
	
	$dbh = null;
	
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}
