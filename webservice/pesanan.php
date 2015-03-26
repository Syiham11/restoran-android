<?php

include 'config.php';


try {
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    $cmd = $_GET['cmd'];
    if($cmd === 'showlist-by-id'){
		$sql = "SELECT b.id_paket,
					   b.jumlah,
					   b.harga,
					   b.diskon,
					   c.nama as nama_item,
					   b.status
                FROM pesanan a
                LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
                LEFT JOIN paket c ON b.id_paket = c.id				
				WHERE a.id = " . $_GET['id'] ;
				
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$pesanan = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($pesanan) . '}';
		
	}else if($cmd === 'showlist'){
      
		$level = $_GET['level'];
		
		$sql = "SELECT a.id,
					   a.id_meja,
					   d.nama as nama_meja,
					   b.jumlah,
					   b.harga,
					   b.diskon,
					   c.nama as nama_item,
					   a.status as status_pesanan,
					   (SELECT COUNT(id)
					    FROM pesanan_details
						WHERE id_pesanan = a.id) as row_count
                FROM pesanan a
                LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
                LEFT JOIN paket c ON b.id_paket = c.id
				LEFT JOIN meja d ON a.id_meja = d.id ";
        
        if($level === 'dapur'){
          
          $sql .= "WHERE (a.status = 'pending' OR a.status = 'proses') AND (b.status = 'pending' OR b.status = 'proses')
		           ORDER BY a.id";
                  
        }else if($level === 'kasir'){
          
          $sql .= "WHERE a.status <> 'selesai' ORDER BY a.id";
		  
        }      	
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$pesanan = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($pesanan) . '}';
		
	}else if($cmd === 'update-status'){
		
        //get id member
        
        if(isset($_GET['password'])){
          
          //jika bayar
          
          //---------GET  MEMBER ID ---------------------
          $sql = "SELECT id FROM member WHERE password = " . $_GET['password'];
        
          $stmt = $dbh->prepare($sql);
          $stmt->execute();
          $result = $stmt -> fetch();
          
          $id_member = $result['id'];
          
          //----------UPDATE HERE -----------------------
          $sql = "UPDATE pesanan
                  SET id_member = :id_member,
                      status = :status
                  WHERE id = :id AND
                        status <> 'selesai'";
				
          $stmt = $dbh->prepare($sql);  		
          $stmt->bindParam("id_member", $id_member);
          $stmt->bindParam("status", $_GET['status']);
          $stmt->bindParam("id", $_GET['id']);
          
          $stmt->execute();
          
          
        }else{
          //jika cuma mau update status
          
          //----------UPDATE HERE -----------------------
          $sql = "UPDATE pesanan
                  SET status = :status
                  WHERE id = :id AND
                        status <> 'selesai'";
				
          $stmt = $dbh->prepare($sql);  		          
          $stmt->bindParam("status", $_GET['status']);
          $stmt->bindParam("id", $_GET['id']);          
          $stmt->execute();
		  
		  if($_GET['status'] === 'matang'){
			$sql = "UPDATE pesanan_details
					SET status = 'selesai'
					WHERE id_pesanan = :id AND
					      status <> 'selesai'";
				
			$stmt = $dbh->prepare($sql);  		          			
			$stmt->bindParam("id", $_GET['id']);          
			$stmt->execute();
		  }else if($_GET['status'] === 'proses'){
			$sql = "UPDATE pesanan_details
					SET status = 'proses'
					WHERE id_pesanan = :id AND
					      status <> 'selesai'";
				
			$stmt = $dbh->prepare($sql);  		          			
			$stmt->bindParam("id", $_GET['id']);          
			$stmt->execute();
		  }
		  
        }
				
	}else if($cmd === 'member-histori-pembelian'){
		//member get
        /*$sql = "SELECT c.nama as nama_item,
					   b.jumlah,
					   ((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100))) as total_bayar					   
				FROM pesanan a
				LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
				LEFT JOIN paket c ON b.id_paket = c.id
                WHERE a.id_member = " .  $_GET['id_member'];
        */
		$sql = "SELECT DATE(a.created_at) as created_at,LPAD(a.id,5,'0') as id_pesanan,c.nama AS nama_item,
						b.jumlah,
						((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100))) AS sub_total,
						(SELECT COUNT(id)
						 FROM pesanan_details
						 WHERE id_pesanan = a.id) as row_count
			   FROM (
						SELECT * FROM pesanan
						ORDER BY id DESC
						LIMIT 10
					) a
			   LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
			   LEFT JOIN paket c ON b.id_paket = c.id
			   WHERE a.id_member = " . $_GET['id_member'] . " AND
					 a.status = 'selesai'
			   ORDER BY a.id DESC";

		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$pesanan = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($pesanan) . '}';
        
    }else if($cmd === 'member-histori-pembelian-total'){
		
		$sql = "SELECT IFNULL(SUM((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100))),0) AS total		 
				FROM pesanan a
				LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
				LEFT JOIN paket c ON b.id_paket = c.id
				WHERE a.id_member = " . $_GET['id_member'] . " AND
					  a.status = 'selesai'";
				
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$total = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($total) . '}';
		
		
	}else if($cmd === 'delete'){
      
        $sql = "DELETE FROM pesanan WHERE id = :id";
				
		$stmt = $dbh->prepare($sql);  		
		$stmt->bindParam("id", $_GET['id']);
		$stmt->execute();
		
    }else if($cmd === 'insert'){
		
		$sql = "INSERT pesanan(id_meja,created_at)
				VALUES(:id_meja,:created_at)";
				
		$stmt = $dbh->prepare($sql);
		$tanggal = date('Y-m-d H:i:s');
		$stmt->bindParam("id_meja", $_GET['id_meja']);
		$stmt->bindParam("created_at", $tanggal);        
		$stmt->execute();
        $last_id = $dbh->lastInsertId();
        
        echo json_encode(array('last_id'=>$last_id));
        
	}else if($cmd === 'insert-detail'){
        
        $sql = "INSERT pesanan_details(id_pesanan,id_paket,jumlah,harga,diskon)
                VALUES(:id_pesanan,:id_paket,:jumlah,:harga,:diskon)";
				
		$stmt = $dbh->prepare($sql);		
		$stmt->bindParam("id_pesanan"	, $_GET['id_pesanan']);
		$stmt->bindParam("id_paket"		, $_GET['id_paket']);
        $stmt->bindParam("jumlah"		, $_GET['jumlah']);
        $stmt->bindParam("harga"		, $_GET['harga']);
        $stmt->bindParam("diskon"		, $_GET['diskon']);
		$stmt->execute();
      
    }else if($cmd === 'get-max-created_at'){
		
		$level = $_GET['level'];
		
		if($level === 'dapur'){
		
			$sql = "SELECT MAX(b.last_update) AS last_update
					FROM pesanan a
					LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
					WHERE a.status='pending'";
				
		}else if($level === 'kasir'){
			
			$sql = "SELECT MAX(b.last_update) AS last_update
					FROM pesanan a
					LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
					WHERE a.status <> 'selesai'";
			
		}
		
        
		$stmt = $dbh->prepare($sql);
		$stmt->execute();
		$result = $stmt -> fetch();
		
		$last_update = $result['last_update'] != null ? $result['last_update'] : '-' ;
        
        echo json_encode(array('last_update'=>$last_update));
		
	}else if($cmd === 'update-jumlah'){
		
		$sql = "UPDATE pesanan_details
		        SET jumlah = ". $_GET['jumlah'] ."
		        WHERE id_pesanan = ". $_GET['id_pesanan'] ." AND
				      status='pending' AND
					  id_paket = " . $_GET['id_paket'];
				
		$stmt = $dbh->prepare($sql);  				
		$stmt->execute();
		
	}else if($cmd === 'delete-from-edit'){
		
		$sql = "DELETE FROM pesanan_details
		        WHERE id_pesanan =" . $_GET['id_pesanan'] . " AND
					  status='pending' AND	
		              id_paket=" . $_GET['id_paket'];
					  
		$stmt = $dbh->prepare($sql);  				
		$stmt->execute();			  
	}
	
	$dbh = null;
	
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}
