<?php

$lettres=array("a","b","c","cd","d","e","ef","f","fg","g","h","js","j","k","m","n","p","r","s","t","u","v","x","y","z","za","zb","zc");
//
?>
<!DOCTYPE html>
<html>
    <head>
        <!-- En-tête de la page -->
        <meta charset="utf-8" />
        <title>Ajustements</title>
		<link rel="stylesheet" href="./sources/style/style.css" />
		
		<!-- JQUERY -->
		<link rel="stylesheet" href="http://libs.allais.eu/jquery/jquery-ui/jquery-ui.css">
		<script type="text/javascript" src="http://libs.allais.eu/jquery/jquery-ui/external/jquery/jquery.js"></script>
		<script type="text/javascript" src="http://libs.allais.eu/jquery/jquery-ui/jquery-ui.min.js"></script>

		<!-- CREATE JS -->
		<script type="text/javascript" src="http://libs.allais.eu/easelJS/EaselJS-0.8.2/lib/easeljs-0.8.2.min.js"></script>
		
		<!--<script type="text/javascript" src="./sources/JS/main.js"></script>-->

		<script type="text/javascript" src="./sources/JS/actions-evenements.js"></script>
		<script type="text/javascript" src="./sources/JS/fonctions.js"></script>
		<script type="text/javascript" src="./sources/JS/tableau_valeurs.js"></script>
		<script>
			ALESAGE={"nominal":0,"EI":0,"ES":0,"borne_sup":0,"borne_inf":0,"moyenne":0,"IT":0,"lettre":"","qualite":0};
			ARBRE={"nominal":0,"EI":0,"ES":0,"borne_sup":0,"borne_inf":0,"moyenne":0,"IT":0,"lettre":"","qualite":0};
			MONTAGE={"nominal":0,"jeu_max":0,"jeu_min":0};
			
			RAYON_NOMINAL_BORNES_MANUELLES=200;

			DEBUG=true;

			listeLettres=[<?php $first=true;
for($i=0;$i<sizeof($lettres);$i++)
{
	if($first)
		$first=false;
	else
		echo ",";
	echo "\"".$lettres[$i]."\"";
}
?>];

	
			limiteSlider=100;//Limite par defaut des ajustements réglable manuellement
		</script>

		<?php include("./sources/PHP/GoogleAnalytics.php");?>
    </head>

	<body>

		<h1>Ajustements</h1>


		<!-- =================== RENTRER AJUSTEMENTS =========================== -->
		<div id="entree_ajustement">
			<h2 class="titre_clicable" onclick="$('#entree_ajustement .zone_a_cacher').toggle(200);" style=";cursor:pointer;">Rentrez votre ajustement :</h2>
			<div class="zone_a_cacher">
						<form>
							&#8709;
							<input type="number" id="form_nominal" name="form_nominal" value="10" onchange="updateFromEntree();" min="1" size="4"/>

							<select name=form_lettre_alesage" id="form_lettre_alesage" onchange="updateFromEntree();">
							<?php
							foreach($lettres as &$lettre)
							{
									echo "
								<option value=\"".strtoupper($lettre)."\" ".($lettre=="h"?"selected":"").">".strtoupper($lettre)."</option>";
							}
							?>
							</select>

							<input type="number" name="form_qualite_alesage" id="form_qualite_alesage" value="7" min="0" max="16" onchange="updateFromEntree();" size="4"/>

							<select name=form_lettre_arbre" id="form_lettre_arbre" onchange="updateFromEntree();">
							<?php
							foreach($lettres as &$lettre)
							{
									echo "
								<option value=\"".$lettre."\" ".($lettre=="h"?"selected":"").">".$lettre."</option>";
							}
							?>
							</select>

							<input type="number" name="form_qualite_arbre" id="form_qualite_arbre" value="7" min="0" max="16" onchange="updateFromEntree()" size="4"/>
						</form>
						<div id="bouton_GO" onclick="updateFromEntree();">GO</div>
			</div>
		</div>



		<!-- =================== AJUSTEMENTS A LA MAIN =========================== -->

		<div id="bornes_manuelles">
			<h2 class="titre_clicable" onclick="$('#bornes_manuelles .zone_a_cacher').toggle(200);">Rentrez les intervalles à la main</h2>
			<div class="zone_a_cacher" style="display:none;">
					<div id="bornes_manuelles_exageration">
						Peu exagéré
						<div id="bornes_manuelles_exageration_curseur">
						</div>
						Très exagéré
					</div>

					<div id="dessin_bornes_manuelles_alesage">
						<canvas id="dessin_bornes_manuelles_alesage_canvas" width="800" height="200"></canvas>
					</div>
					<div id="bornes_manuelles_alesage">
						<div id="bornes_manuelles_alesage_gauche">
							<div class="curseur_manuel"><!--
							--></div><!--
						--></div><!--
						--><div id="bornes_manuelles_alesage_droite"><!--
							--><div class="curseur_manuel"><!--
						-->	</div>
						</div>
					</div>
					<div id="bornes_manuelles_ecarts_alesage">
						<table>
								<tr>
										<td rowspan=2>&#8709;<sub>♀</sub> = <span id="bornes_manuelles_ecarts_alesage_nominal"></span></td>
										<td id="bornes_manuelles_ecarts_alesage_inf"></td>
								</tr>
								<tr>
										<td id="bornes_manuelles_ecarts_alesage_sup"></td>
								</tr>
						</table>
						<!--<div id="bornes_manuelles_ecarts_alesage_inf"/>EI = <span></span></div> ; 
						<div id="bornes_manuelles_ecarts_alesage_sup"/>ES = <span></span></div>-->
					</div>
					<div id="bornes_manuelles_nominal">
							<div id="bornes_manuelles_nominal_fleche_gauche">&#8676;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;</div>
							<div id="bornes_manuelles_nominal_centre"><form>&#8709;<sub>nom.</sub> = <input type="number"  min="1" width="3" id="form_nominal_bornes_manuelles" name="form_nominal_bornes_manuelles" onchange="updateFromBornesManuelles();"/></form></div>
							<div id="bornes_manuelles_nominal_fleche_droite"><div>&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#8677;</div></div>
					</div>
					<div id="bornes_manuelles_ecarts_arbre">
						<table>
								<tr>
										<td rowspan=2>&#8709;<sub>♂</sub> = <span id="bornes_manuelles_ecarts_arbre_nominal"></span></td>
										<td id="bornes_manuelles_ecarts_arbre_inf"></td>
								</tr>
								<tr>
										<td id="bornes_manuelles_ecarts_arbre_sup"></td>
								</tr>
						</table>
						<!--<div id="bornes_manuelles_ecarts_arbre_inf"/>EI = <span></span></div> ; 
						<div id="bornes_manuelles_ecarts_arbre_sup"/>ES = <span></span></div>-->
					</div>
					<div id="bornes_manuelles_arbre">
						<div id="bornes_manuelles_arbre_gauche">
							<div class="curseur_manuel"><!--
							--></div><!--
						--></div><!--
						--><div id="bornes_manuelles_arbre_droite"><!--
							--><div class="curseur_manuel"><!--
							--></div>
						</div>
					</div>
					<div id="dessin_bornes_manuelles_arbre">
						<canvas id="dessin_bornes_manuelles_arbre_canvas" width="800" height="200"></canvas>
					</div>
			</div>
		</div>
		
		<script>
			$( "#bornes_manuelles_exageration_curseur" ).slider({
				range: false,
				  min: -4,
				  max: 0,
					step:0.01,
				  value: -Math.log10(limiteSlider),
				  slide: function( event, ui ) {//Action a faire quand ça bouge
						updateFromBornesManuellesExageration();
					//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				  }
				});
			 $( "#bornes_manuelles_alesage_gauche .curseur_manuel" ).slider({
				range: true,
				  min: -limiteSlider,
				  max: limiteSlider,
				  values: [ 0, 10 ],
				  slide: function( event, ui ) {//Action a faire quand ça bouge
					updateFromBornesManuellesAlesageGauche();
					updateFromBornesManuelles();
					//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				  }
				});
			 $( "#bornes_manuelles_alesage_droite .curseur_manuel" ).slider({
				range: true,
				  min: -limiteSlider,
				  max: limiteSlider,
				  values: [ 0, 10 ],
				  slide: function( event, ui ) {//Action a faire quand ça bouge
					updateFromBornesManuellesAlesageDroite();
					updateFromBornesManuelles();
					//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				  }
				});
			 $( "#bornes_manuelles_arbre_gauche .curseur_manuel" ).slider({
				range: true,
				  min: -limiteSlider,
				  max: limiteSlider,
				  values: [ 0, 10 ],
				  slide: function( event, ui ) {//Action a faire quand ça bouge
					updateFromBornesManuellesArbreGauche();
					updateFromBornesManuelles();
					//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				  }
				});
			 $( "#bornes_manuelles_arbre_droite .curseur_manuel" ).slider({
				range: true,
				  min: -limiteSlider,
				  max: limiteSlider,
				  values: [ 0, 10 ],
				  slide: function( event, ui ) {//Action a faire quand ça bouge
					updateFromBornesManuellesArbreDroite();
					updateFromBornesManuelles();
					//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				  }
				});
			//Ajout des evenements

			
		</script>





		<!-- =================== AJUSTEMENTS A LA MAIN =========================== -->

		<div id="resultat">
			<table>
				<caption>Valeurs</caption>
				<tr>
					<th></th>
					<th>Écart inf.</th>
					<th>Nominal</th>
					<th>Écart sup.</th>
					<th>I.T.</th>
					<th>Moy.</th>
				</tr>
				<tr>
					<td rowspan="2" class="titre_tab" >Alésage</td>
					<td id="res_alesage_EI">-0</td>
					<td id="res_alesage_nominal" rowspan="2">10</td>
					<td id="res_alesage_ES">+0</td>
					<td id="res_alesage_IT" rowspan="2">0</td>
					<td id="res_alesage_moyenne" rowspan="2">0</td>
				</tr>
				<tr>
					<td id="res_alesage_borne_inf">20</td>
					<td id="res_alesage_borne_sup">30</td>
				</tr>
				<tr>
					<td rowspan="2" class="titre_tab">Arbre</td>
					<td id="res_arbre_EI">+0</td>
					<td id="res_arbre_nominal" rowspan="2">10</td>
					<td id="res_arbre_ES">-0</td>
					<td id="res_arbre_IT" rowspan="2">0</td>
					<td id="res_arbre_moyenne" rowspan="2">0</td>
				</tr>
				<tr>
					<td id="res_arbre_borne_inf">10</td>
					<td id="res_arbre_borne_sup">30</td>
				</tr>
			</table>

			<div id="jeu_max"></div>
			<div id="jeu_min"></div>
		</div>
		
		
		

	</body>
	
	<script>
		updateFromEntree();
	</script>
</html>
