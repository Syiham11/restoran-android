-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.20 - Source distribution
-- Server OS:                    Linux
-- HeidiSQL Version:             9.1.0.4880
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for restoran
CREATE DATABASE IF NOT EXISTS `restoran` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `restoran`;


-- Dumping structure for table restoran.meja
CREATE TABLE IF NOT EXISTS `meja` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='status:\r\nY = digunakan\r\nN = tidak digunakan';

-- Dumping data for table restoran.meja: ~10 rows (approximately)
DELETE FROM `meja`;
/*!40000 ALTER TABLE `meja` DISABLE KEYS */;
INSERT INTO `meja` (`id`, `nama`, `status`) VALUES
	(1, 'Meja 1', 'Y'),
	(2, 'Meja 2', 'Y'),
	(3, 'Meja 3', 'Y'),
	(4, 'Meja 4', 'Y'),
	(5, 'Meja 5', 'Y'),
	(6, 'Meja 6', 'Y'),
	(7, 'Meja 7', 'Y'),
	(8, 'Meja 8', 'Y'),
	(9, 'Meja 9', 'Y'),
	(10, 'Meja 10', 'Y');
/*!40000 ALTER TABLE `meja` ENABLE KEYS */;


-- Dumping structure for table restoran.member
CREATE TABLE IF NOT EXISTS `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT 'member',
  `password` varchar(50) NOT NULL DEFAULT 'guest',
  `nama` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `alamat` varchar(50) NOT NULL,
  `id_region` tinyint(4) NOT NULL,
  `level` enum('member') DEFAULT 'member',
  `status_aktif` enum('Y','N') DEFAULT 'Y',
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COMMENT='password = bisa nomor ktp / sim / atau id card yang lain';

-- Dumping data for table restoran.member: ~3 rows (approximately)
DELETE FROM `member`;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` (`id`, `username`, `password`, `nama`, `email`, `alamat`, `id_region`, `level`, `status_aktif`, `last_update`) VALUES
	(0, 'member', 'guest', 'guest', 'guest@guest.com', '-', 1, 'member', 'Y', '2014-10-22 14:30:21'),
	(1, 'member', '1122', 'xxx', 'xxx', 'xxx', 1, 'member', 'Y', '2014-10-28 00:45:34'),
	(2, 'member', '2233', 'member2', 'member2@gmail.com', '-', 4, 'member', 'Y', '2014-10-28 03:54:16');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;


-- Dumping structure for table restoran.member_saldo
CREATE TABLE IF NOT EXISTS `member_saldo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_member` int(11) NOT NULL,
  `deposit` double NOT NULL,
  `created_at` datetime NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table restoran.member_saldo: ~1 rows (approximately)
DELETE FROM `member_saldo`;
/*!40000 ALTER TABLE `member_saldo` DISABLE KEYS */;
INSERT INTO `member_saldo` (`id`, `id_member`, `deposit`, `created_at`, `last_update`) VALUES
	(5, 2, 100000, '2014-10-27 15:00:14', '2014-10-27 21:00:14'),
	(6, 1, 5000, '2014-10-27 15:00:14', '2014-10-28 00:45:49');
/*!40000 ALTER TABLE `member_saldo` ENABLE KEYS */;


-- Dumping structure for table restoran.paket
CREATE TABLE IF NOT EXISTS `paket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `jenis` enum('makanan','minuman') NOT NULL DEFAULT 'makanan',
  `harga` double NOT NULL,
  `diskon` float NOT NULL,
  `gambar` varchar(50) NOT NULL,
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  `habis` enum('Y','N') NOT NULL DEFAULT 'N',
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table restoran.paket: ~3 rows (approximately)
DELETE FROM `paket`;
/*!40000 ALTER TABLE `paket` DISABLE KEYS */;
INSERT INTO `paket` (`id`, `nama`, `jenis`, `harga`, `diskon`, `gambar`, `status`, `habis`, `last_update`) VALUES
	(1, 'Sego Tempong', 'makanan', 12000, 10, 'test.jpg', 'Y', 'N', '2014-10-25 12:34:31'),
	(2, 'Sego Pecel', 'makanan', 15000, 0, '', 'Y', 'N', '2014-10-25 12:34:31'),
	(3, 'Es Degan', 'minuman', 4000, 0, '', 'Y', 'N', '2014-10-26 01:00:51');
/*!40000 ALTER TABLE `paket` ENABLE KEYS */;


-- Dumping structure for table restoran.pesanan
CREATE TABLE IF NOT EXISTS `pesanan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_member` int(11) NOT NULL DEFAULT '0',
  `id_meja` tinyint(4) NOT NULL,
  `status` enum('pending','proses','matang','terantar','selesai') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table restoran.pesanan: ~1 rows (approximately)
DELETE FROM `pesanan`;
/*!40000 ALTER TABLE `pesanan` DISABLE KEYS */;
INSERT INTO `pesanan` (`id`, `id_member`, `id_meja`, `status`, `created_at`, `last_update`) VALUES
	(1, 0, 1, 'selesai', '2014-11-30 15:35:12', '2014-11-30 22:15:04'),
	(2, 0, 3, 'pending', '2014-12-01 07:42:39', '2014-12-01 13:43:07');
/*!40000 ALTER TABLE `pesanan` ENABLE KEYS */;


-- Dumping structure for table restoran.pesanan_details
CREATE TABLE IF NOT EXISTS `pesanan_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pesanan` varchar(50) DEFAULT NULL,
  `id_paket` int(11) NOT NULL DEFAULT '0',
  `jumlah` smallint(6) NOT NULL DEFAULT '0',
  `harga` double NOT NULL DEFAULT '0',
  `diskon` float NOT NULL DEFAULT '0',
  `catatan` tinytext,
  `status` enum('pending','proses','selesai') DEFAULT 'pending',
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- Dumping data for table restoran.pesanan_details: ~8 rows (approximately)
DELETE FROM `pesanan_details`;
/*!40000 ALTER TABLE `pesanan_details` DISABLE KEYS */;
INSERT INTO `pesanan_details` (`id`, `id_pesanan`, `id_paket`, `jumlah`, `harga`, `diskon`, `catatan`, `status`, `last_update`) VALUES
	(3, '1', 1, 5, 12000, 10, NULL, 'selesai', '2014-11-30 22:06:09'),
	(4, '1', 2, 5, 15000, 0, NULL, 'selesai', '2014-11-30 22:06:14'),
	(6, '1', 1, 2, 12000, 10, NULL, 'selesai', '2014-11-30 22:06:12'),
	(7, '1', 2, 2, 15000, 0, NULL, 'selesai', '2014-11-30 22:10:41'),
	(8, '1', 1, 4, 12000, 10, NULL, 'selesai', '2014-11-30 22:14:12'),
	(9, '1', 2, 3, 15000, 0, NULL, 'selesai', '2014-11-30 22:14:12'),
	(10, '1', 3, 2, 4000, 0, NULL, 'selesai', '2014-11-30 22:14:12'),
	(11, '2', 3, 2, 4000, 0, NULL, 'pending', '2014-12-01 13:42:39');
/*!40000 ALTER TABLE `pesanan_details` ENABLE KEYS */;


-- Dumping structure for table restoran.region
CREATE TABLE IF NOT EXISTS `region` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table restoran.region: ~4 rows (approximately)
DELETE FROM `region`;
/*!40000 ALTER TABLE `region` DISABLE KEYS */;
INSERT INTO `region` (`id`, `nama`) VALUES
	(1, 'Rogojampi'),
	(2, 'Genteng'),
	(3, 'Banyuwangi'),
	(4, 'Banyuwangi kota');
/*!40000 ALTER TABLE `region` ENABLE KEYS */;


-- Dumping structure for table restoran.settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `tipe` varchar(50) NOT NULL,
  `content_setting` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table restoran.settings: ~4 rows (approximately)
DELETE FROM `settings`;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` (`id`, `title`, `tipe`, `content_setting`) VALUES
	(1, 'Nama Situs', 'site_name', 'Aplikasi Restoran'),
	(2, 'Quotes Situs', 'sites_quotes', '-'),
	(3, 'Teks Footer', 'site_footer', 'Aplikasi Restoran  Copyright 2014'),
	(4, 'Limit Data', 'site_limit_data', '10');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;


-- Dumping structure for table restoran.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `alamat` varchar(50) DEFAULT NULL,
  `level` enum('waiter','dapur','kasir','admin') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table restoran.user: ~4 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `username`, `password`, `nama`, `email`, `alamat`, `level`) VALUES
	(1, 'waiter', 'f64cff138020a2060a9817272f563b3c', 'nama waiter', 'waiter@gmail.com', 'test ajah', 'waiter'),
	(2, 'dapur', 'de20b1d289dd6005ba8116085122f144', 'nama dapur', 'dapur@gmail.com', '-', 'dapur'),
	(3, 'kasir', 'c7911af3adbd12a035b289556d96470a', 'nama kasir', 'kasir@gmail.com', '-', 'kasir'),
	(4, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'nama admin', 'admin@gmail.com', '-', 'admin');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
