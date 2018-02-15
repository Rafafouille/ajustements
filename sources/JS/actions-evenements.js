



// =======================================================================================

function updateFromEntree()
{
	var nominal=parseFloat($('#form_nominal').val());
	var lettre_alesage=$('#form_lettre_alesage').val();
	var qualite_alesage=parseFloat($('#form_qualite_alesage').val());
	var lettre_arbre=$('#form_lettre_arbre').val();
	var qualite_arbre=parseFloat($('#form_qualite_arbre').val());

	var bornesArbre=getBornes(nominal,lettre_arbre,qualite_arbre);
	var bornesAlesage=getBornes(nominal,lettre_alesage,qualite_alesage);
	var bornes={"nominal":nominal,"arbre":bornesArbre,"alesage":bornesAlesage};
	updateVariables(bornes);
	
	
	//updateAffichage();
	updateTableau();
	updateBornesManuelles();
}


function updateFromBornesManuelles()
{
	var diametre=parseInt($("#form_nominal_bornes_manuelles").val());//a changer
	var infAlesage=$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("values",0);
	var supAlesage=$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("values",1);
	var ITAlesage=Math.abs(supAlesage-infAlesage);

	var infArbre=$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("values",0);
	var supArbre=$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("values",1);
	var ITArbre=Math.abs(supArbre-infArbre);

	var qualiteAlesage=findNearestQualite(ITAlesage,diametre);
	var qualiteArbre=findNearestQualite(ITArbre,diametre);

	var lettreAlesage=findNearesLettre(infAlesage,supAlesage,qualiteAlesage,diametre,false);
	var lettreArbre=findNearesLettre(infArbre,supArbre,qualiteArbre,diametre,true);

	var bornesAlesage=getBornes(diametre,lettreAlesage,qualiteAlesage);
	var bornesArbre=getBornes(diametre,lettreArbre,qualiteArbre);
	var bornes={"nominal":diametre,"arbre":bornesArbre,"alesage":bornesAlesage};
	updateVariables(bornes);

	

	updateTableau();
	updateEntree();
	dessine_bornes_alesage();
	dessine_bornes_arbre();
	updageBornesNumeriquesInBonresManuelles();
}



function updateFromBornesManuellesAlesageGauche()
{
	var sup=-$("#bornes_manuelles_alesage_gauche .curseur_manuel").slider("values",0);
	var inf=-$("#bornes_manuelles_alesage_gauche .curseur_manuel").slider("values",1);
	$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("values",0,inf);
	$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("values",1,sup);
}

function updateFromBornesManuellesAlesageDroite()
{
	var sup=$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("values",0);
	var inf=$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("values",1);
	$("#bornes_manuelles_alesage_gauche .curseur_manuel").slider("values",0,-inf);
	$("#bornes_manuelles_alesage_gauche .curseur_manuel").slider("values",1,-sup);
}

function updateFromBornesManuellesArbreGauche()
{
	var sup=-$("#bornes_manuelles_arbre_gauche .curseur_manuel").slider("values",0);
	var inf=-$("#bornes_manuelles_arbre_gauche .curseur_manuel").slider("values",1);
	$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("values",0,inf);
	$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("values",1,sup);
}

function updateFromBornesManuellesArbreDroite()
{
	var sup=$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("values",0);
	var inf=$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("values",1);
	$("#bornes_manuelles_arbre_gauche .curseur_manuel").slider("values",0,-inf);
	$("#bornes_manuelles_arbre_gauche .curseur_manuel").slider("values",1,-sup);
}

function updateFromBornesManuellesExageration()
{
	var maxi=getExageration();
	$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("option","min",-maxi);
	$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("option","max",maxi);
	$("#bornes_manuelles_arbre_gauche .curseur_manuel").slider("option","min",-maxi);
	$("#bornes_manuelles_arbre_gauche .curseur_manuel").slider("option","max",maxi);
	$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("option","min",-maxi);
	$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("option","max",maxi);
	$("#bornes_manuelles_alesage_gauche .curseur_manuel").slider("option","min",-maxi);
	$("#bornes_manuelles_alesage_gauche .curseur_manuel").slider("option","max",maxi);
	dessine_bornes_arbre();
	dessine_bornes_alesage();
}


