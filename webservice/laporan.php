<?php

include 'config.php';


try {
    
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    $cmd = $_GET['cmd'];
    
	if($cmd === 'get-makanan-top5'){		
		
		$sql = "SELECT c.nama as nama,
                        SUM(b.jumlah) as jumlah_pesanan
               FROM pesanan a
               LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
               LEFT JOIN paket c ON b.id_paket = c.id
               WHERE c.jenis = 'makanan'
               GROUP BY b.id_paket 
               ORDER BY SUM(b.jumlah) DESC LIMIT 5";        
		
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$makanan = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($makanan) . '}';
		
	}else if($cmd === 'get-minuman-top5'){
		
		$sql = "SELECT c.nama as nama,
                          SUM(b.jumlah) as jumlah_pesanan
                 FROM pesanan a
                 LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
                 LEFT JOIN paket c ON b.id_paket = c.id
                 WHERE c.jenis = 'minuman'
                 GROUP BY b.id_paket 
                 ORDER BY SUM(b.jumlah) DESC LIMIT 5";
				
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';
				
	}else if($cmd === 'laporan-tahunan'){
	/*
		2012   xxx
		2013   xxx
		2014   xxx
	*/
		$sql = "SELECT YEAR(a.created_at) AS tahun, 
						SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_pendapatan
				FROM pesanan a
				LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
				LEFT JOIN paket c ON b.id_paket = c.id
				WHERE a.status = 'selesai'
				GROUP BY YEAR(a.created_at)
				ORDER BY YEAR(a.created_at) DESC";
				
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';

				 
	}else if($cmd === 'laporan-bulanan'){
		$tahun = $_GET['tahun'];
		$sql = "SELECT YEAR(a.created_at) as tahun,
					   MONTH(a.created_at) AS bulan, 
					   SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_pendapatan
			   FROM pesanan a
			   LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
			   LEFT JOIN paket c ON b.id_paket = c.id
			   WHERE YEAR(a.created_at) = " . $tahun ." AND
					 a.status = 'selesai'
			   GROUP BY YEAR(a.created_at),
						MONTH(a.created_at)";
	/*
		tahun xxx
		bulan ke - 1 xxx
		bulan ke - 2 xxx
	*/
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';
	
	
	}else if($cmd === 'laporan-mingguan'){
		$tahun = $_GET['tahun'];
		$bulan = $_GET['bulan'];
		
		$sql = "SELECT YEAR(a.created_at) as tahun,
					   MONTH(a.created_at) as bulan,
					   (1 + ((DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_ADD(a.created_at, INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + (DATE_FORMAT(a.created_at, '%d')-2)) DIV 7) as minggu_ke,					   
					   SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_pendapatan
				FROM pesanan a
			    LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
				LEFT JOIN paket c ON b.id_paket = c.id
				WHERE YEAR(a.created_at) =  " . $tahun . " AND
					  MONTH(a.created_at) = " . $bulan . " AND
					  a.status = 'selesai'
				GROUP BY YEAR(a.created_at),
						 MONTH(a.created_at),
						 (1 + ((DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_ADD(a.created_at, INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + (DATE_FORMAT(a.created_at, '%d')-2)) DIV 7)";
	/*		
		tahun xxx bulan xxx
		minggu ke - 1 xxx
		minggu ke - 2 xxx
	*/
	
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';

	
	}else if($cmd === 'laporan-harian'){
		$tahun = $_GET['tahun'];
		$bulan = $_GET['bulan'];
		$minggu = $_GET['minggu'];
	/*
		tahun xxx bulan xxx minggu xxx
		hari ke - 1 xxx
		hari ke - 2 xxx
	*/	
		$sql = $sql = "SELECT YEAR(a.created_at) as tahun,
							  MONTH(a.created_at) as bulan,
							  (1 + ((DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_ADD(a.created_at, INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + (DATE_FORMAT(a.created_at, '%d')-2)) DIV 7) as minggu_ke,
							  DAY(a.created_at) as hari_ke,
							  SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_pendapatan
					   FROM pesanan a
					   LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
					   LEFT JOIN paket c ON b.id_paket = c.id
					   WHERE YEAR(a.created_at) =  " . $tahun . " AND
							 MONTH(a.created_at) = " . $bulan . " AND
							 (1 + ((DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_ADD(a.created_at, INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + (DATE_FORMAT(a.created_at, '%d')-2)) DIV 7) = " . $minggu . " AND
					         a.status = 'selesai'
					   GROUP BY YEAR(a.created_at),
								MONTH(a.created_at),
								(1 + ((DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_ADD(a.created_at, INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + (DATE_FORMAT(a.created_at, '%d')-2)) DIV 7),
								DAY(a.created_at)";
								
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';
	
	
	}else if($cmd === 'laporan-details-harian'){
		$tahun = $_GET['tahun'];
		$bulan = $_GET['bulan'];
		$minggu = $_GET['minggu'];
		$hari = $_GET['hari'];
	/*
		no_pesanan  xxx
	*/
	
	}else if($cmd === 'get-pendapatan-hari-ini'){
		
        $sql = "SELECT SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_pendapatan
				FROM pesanan a
				LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
				LEFT JOIN paket c ON b.id_paket = c.id
				WHERE DATE(a.created_at) = CURDATE()";

		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';
        
    }else if($cmd === 'get-list-pendapatan-hari-ini'){
		
        $sql = "SELECT LPAD(a.id,5,'0') as id,                       
                       SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_pendapatan
               FROM pesanan a
               LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
               LEFT JOIN paket c ON b.id_paket = c.id
               WHERE date(a.created_at) = CURDATE()
               GROUP BY a.id";

		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';
        
    }else if($cmd === 'get-list-pendapatan-minggu-ini'){
      
        $sql = "SELECT DATE(a.created_at) as tanggal,
                          SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_pendapatan
                 FROM pesanan a
                 LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
                 LEFT JOIN paket c ON b.id_paket = c.id
                 WHERE YEARWEEK(a.created_at,1) = YEARWEEK(CURDATE(),1)
                 GROUP BY DATE(a.created_at)
                 ORDER BY DATE(a.created_at) ASC";
				
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';
		
    }else if($cmd === 'get-pendapatan-bulan-ini'){
		
		$sql = "SELECT (1 + ((DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_ADD(a.created_at, INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + (DATE_FORMAT(a.created_at, '%d')-2)) DIV 7) as minggu_ke,
                        SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_bayar
               FROM pesanan a
               LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
               LEFT JOIN paket c ON b.id_paket = c.id
               WHERE MONTH(a.created_at) = MONTH(CURDATE()) AND
                     YEAR(a.created_at) = YEAR(CURDATE())
               GROUP BY YEAR(a.created_at),
                       MONTH(a.created_at),
                       (1 + ((DATE_FORMAT(DATE_ADD(LAST_DAY(DATE_ADD(a.created_at, INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + (DATE_FORMAT(a.created_at, '%d')-2)) DIV 7)";
				
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';
		
	}else if($cmd === 'get-pendapatan-tahun-ini'){
		
		$sql = "SELECT MONTH(a.created_at) as bulan_ke,
                          SUM(IFNULL((b.jumlah * b.harga) - ((b.jumlah * b.harga) * (b.diskon/100)),0)) AS total_pendapatan
                 FROM pesanan a
                 LEFT JOIN pesanan_details b ON a.id = b.id_pesanan
                 LEFT JOIN paket c ON b.id_paket = c.id
                 WHERE YEAR(a.created_at) = YEAR(CURDATE())		
                 GROUP BY MONTH(a.created_at)
                 ORDER BY MONTH(a.created_at) ASC";
				
		header("content-type: application/json");
		$stmt = $dbh->query($sql);  
		
		$minuman = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		echo '{"items":' . json_encode($minuman) . '}';
		
	}
	$dbh = null;
	
	
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}