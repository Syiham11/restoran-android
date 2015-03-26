<?php

  include 'config.php';
  
  $menu_sidebar =
        "<div id=\"dashboard\" class=\"menu-item\">
              <strong class=\"home-icon\"></strong>
              <a class=\"menu-disabled\" href=\"dashboard.html\">Home</a>
          </div>

          <!--member,waiter menu-------->
          <div id=\"menu\" class=\"menu-item\">
              <strong class=\"icon-shadow-dinnerplate\"></strong>
              <a class=\"menu-disabled\" href=\"menu.html\">Menu</a>
          </div>

          <div id=\"pesanan\" class=\"menu-item\">
              <strong class=\"icon-shadow-stickynote\"></strong>
              <a class=\"menu-disabled\" href=\"pesanan.html\">Pesanan</a>
          </div>
          
          <!--
          <div id=\"edit-pesanan\" class=\"menu-item\">
              <strong class=\"icon-shadow-stickynote\"></strong>
              <a class=\"menu-disabled\" href=\"ubah-pesanan.html\">Edit Pesanan</a>
          </div>
          -->
          
          <!--
          <div id=\"pesanan-on-process\" class=\"menu-item\">
              <strong class=\"icon-shadow-stickynote\"></strong>
              <a class=\"menu-disabled\" href=\"pesanan_on_process.html\">Pesanan On Process</a>
          </div>
          -->
          
          <div id=\"ganti-meja\" class=\"menu-item\">
              <strong class=\"icon-shadow-table\"></strong>
              <a class=\"menu-disabled\" href=\"ganti-meja.html\">Pindah Meja</a>
          </div>
          
          <!--member menu-------->
          <div id=\"member-laporan\" class=\"menu-item\">
              <strong class=\"features-icon\"></strong>
              <a class=\"menu-disabled deploy-submenu\" href=\"#\">Laporan</a>
              <div class=\"clear\"></div>
              <div class=\"submenu\" style=\"overflow: hidden; display: block\">
                  <a href=\"member-histori-pesanan.html\">Histori Pesanan</a>  <em class=\"submenu-decoration\"></em>
                  <a href=\"member-histori-saldo.html\">Histori saldo</a>  <em class=\"submenu-decoration\"></em> 
              </div>
          </div>

           <!--admin menu -->
          <div id=\"laporan\" class=\"menu-item\">
              <strong class=\"features-icon\"></strong>
              <a class=\"menu-disabled deploy-submenu\" href=\"#\">Laporan</a>
              <div class=\"clear\"></div>
              <div class=\"submenu\" style=\"overflow: hidden; display: block\">
                  <a href=\"laporan-pendapatan.html\">Pendapatan</a>  <em class=\"submenu-decoration\"></em>                        
              </div>
          </div>

          <div id=\"paket\" class=\"menu-item\">
              <strong class=\"features-icon\"></strong>
              <a class=\"menu-disabled deploy-submenu\" href=\"#\">Paket</a>
              <div class=\"clear\"></div>
              <div class=\"submenu\"  style=\"overflow: hidden; display: block\">
                  <a href=\"paket-makanan.html\">Makanan</a>  <em class=\"submenu-decoration\"></em>
                  <a href=\"paket-minuman.html\">Minuman</a>  <em class=\"submenu-decoration\"></em> 
              </div>
          </div>

          <div id=\"stok\" class=\"menu-item\">
              <strong class=\"features-icon\"></strong>
              <a class=\"menu-disabled deploy-submenu\" href=\"#\">Stok</a>
              <div class=\"clear\"></div>
              <div class=\"submenu\" style=\"overflow: hidden; display: block\">
                  <a href=\"stok-makanan.html\">Makanan</a>  <em class=\"submenu-decoration\"></em>
                  <a href=\"stok-minuman.html\">Minuman</a>  <em class=\"submenu-decoration\"></em> 
              </div>
          </div>

          <div id=\"region\" class=\"menu-item\">
              <strong class=\"icon-shadow-maps\"></strong>
              <a class=\"menu-disabled\" href=\"region.html\">Region</a>
          </div>

          <div id=\"meja\" class=\"menu-item\">
              <strong class=\"icon-shadow-table\"></strong>
              <a class=\"menu-disabled\" href=\"meja.html\">Meja</a>
          </div>

          <div id=\"member\" class=\"menu-item\">
              <strong class=\"icon-shadow-users\"></strong>
              <a class=\"menu-disabled\" href=\"member.html\">Member</a>
          </div>

          <div id=\"user\" class=\"menu-item\">
              <strong class=\"icon-shadow-users\"></strong>
              <a class=\"menu-disabled\" href=\"user.html\">User</a>
          </div>

          <div id=\"settings\" class=\"menu-item\">
              <strong class=\"icon-settings2\"></strong>
              <a class=\"menu-disabled\" href=\"settings.html\">Settings</a>
          </div>";
                
      echo $menu_sidebar;        
