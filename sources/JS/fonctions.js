

//Savoir si un variable existe ======================================================================================
function isset(obj)
{
	return typeof obj !== 'undefined'
}

//Fonction qui affiche le debug =====================================
function debug(txt)
{
	if(DEBUG)
		console.log(txt);
}


//Renvoie l'indice correspondant a la plage de diametre, relatif au tableau $bornesDiametres ======================================
//0 correpsond à l'intervalle ]1,3]
function findBorneDiametre(diametre)
{
	res=-1;
	for(i=0;i<bornesDiametres.length-1;i++)
	{
		if(diametre>bornesDiametres[i] && diametre<=bornesDiametres[i+1])
		{
			res=i;
			break;
		}
	}
	return res;
}


//Fonctions qui crée un tableau avec l'opposé des valeurs =====================================
function opposeTab(tab)
{
	res=[]
	tab.forEach(function(v){
													if(typeof v=="number")
														res.push(-v);
													else
														res.push(v);
												})
	return res;
}

// Fonction qui additionne 2 tableaux ==========================================================
function additionneTab(tab1,tab2)
{
	res=[]
	for(var i=0;i<tab1.length;i++)
	{
		res.push(tab1[0]+tab2[0])
	}
	return res;
}


//************************************************************
//Fonction qui donne les écarts EI et ES pour un diametre donne, une lettre et une qualite
function getBornes(diametre,lettre,qualite)
{
	isArbre=(lettre==lettre.toLowerCase());	//True si c'est un alesage

	i_diametre=findBorneDiametre(diametre);	//Position du diamètre


	if(!isset(ITQ[qualite]) || i_diametre==-1)// A CHANGER !!!!!!!!
	{
		sup="error";
		inf="error";
	}
	else if(isArbre)//Si c'est un arbre
		return getBornes_arbre(i_diametre,diametre,lettre,qualite);
	else	//Si alesage
		return getBornes_alesage(i_diametre,diametre,lettre,qualite);
}

//Renvoie les ecarts EI et ES pour un arbre==================================================
//i : indice de où est le diametre dans els tableaux
function getBornes_arbre(i,diametre,lettre_originale,qualite)
{
	debug("RECHERCHE DE LA BORNE : "+String(diametre)+" "+lettre_originale+qualite+" ========================");
	debug("   -> i_diametre = "+String(i));
	qualite=String(qualite);	//On convertie en chaine (au cas ou)
	var IT=ITQ[qualite][i];//IT
	debug("   -> IT = "+IT);

	var lettre=lettre_originale;	//on garde la lettre originale avant transformation

	//Gestion des lettres spéciales
	if(lettre=="j" && (qualite=="5" || qualite=="6"))
		lettre="j56";
	if(lettre=="j" && qualite=="7")
		lettre="j7";
	if(lettre=="j" && qualite=="8")
		lettre="j8";
	if(lettre=="k")
	{
		if(parseInt(qualite)>=4 && parseInt(qualite)<=7)
			lettre="k4567";
		else
			lettre="k<=3>7";
	}

	if(lettre!=lettre_originale)
		debug("	-> Lettre '"+lettre_originale+"' transformées en '"+lettre+"'");



	if((lettre=="a" || lettre=="b")&& diametre<=1)	//Les abres a et b sont prévus qu'au-delà de 1mm
	{
		debug("	/!\\ Les arbres tolérancés 'a' et 'b' sont prévus qu'au-delà de 1mm");
		ES="error";
		EI="error";
	}
	else if(lettre=="js")	//js correspond à une cote centree
	{
		debug("	-> js = cote centrée");
		if(parseInt(qualite)>=7 && parseInt(qualite)<=11 && IT%2==1)//Pour les IT impaire, pour les qualité 7 a 11...
		{
			IT=Math.floor(IT/2)*2;//...On l'arrondi à l'entier pair immédiatement inférieur
			debug("  -> IT modifié : "+String(IT)+" (7<=qualite<=11 et IT impaire)");
		}
		ES=IT*0.001/2;
		EI=-IT*0.001/2;
		debug("  -> ES : "+String(IT/2));
		debug("  -> EI : "+String(-IT/2));
	}
	else if(isset(borneSupArbre[lettre]))//Si la lettre est <= à js
	{
		debug("   -> On travaille avec la borne sup de l'arbre");
		var borneSup=borneSupArbre[lettre][i];
		if(borneSup!="-" && borneSup!=undefined)
		{
			debug("	-> ES : "+String(borneSup));
			debug("	-> EI : "+String(borneSup-IT));
			ES=borneSup*0.001;
			EI=ES-IT*0.001;
		}
		else
		{
			debug("	/!\\ La borne sup n'existe pas pour la qualité demandée.");
			ES="error";
			EI="error";
		}
	}
	else if(isset(borneInfArbre[lettre]))//si la lettre >=j
	{
		debug("   -> On travaille avec la borne inf de l'arbre");
		var borneInf=borneInfArbre[lettre][i];
		if(borneInf!="-" && borneInf!=undefined)
		{
			debug("	-> EI : "+String(borneInf));
			debug("	-> ES : "+String(borneInf+IT));
			EI=borneInf*0.001;
			ES=EI+IT*0.001;
		}
		else
		{
			debug("	/!\\ La borne inf n'existe pas pour la qualité demandée.");
			ES="error";
			EI="error";
		}
	}
	else	//si on ne le trouve pas dans le tableau
	{
		debug("	/!\\ La cote ne correspond à rien dans le tableau de valeurs.");
			ES="error";
			EI="error";
	}

	return {"nominal":diametre,"EI":EI,"ES":ES,"lettre":lettre_originale,"qualite":qualite};
}


//==============================================================
function getBornes_alesage(i,diametre,lettre_originale,qualite)
{
	debug("RECHERCHE DE LA BORNE : "+String(diametre)+" "+lettre_originale+qualite+" ========================");
	debug("   -> i_diametre = "+String(i));
	qualite=String(qualite);	//On convertie en chaine (au cas ou)
	var IT=ITQ[qualite][i];//IT
	debug("   -> IT = "+IT);

	var lettre=lettre_originale;	//on garde la lettre originale avant transformation



	//Gestion des lettres spéciales
	if(lettre=="J" && qualite=="6")
		lettre="J6";
	else if(lettre=="J" && qualite=="7")
		lettre="J7";
	else if(lettre=="J" && qualite=="8")
		lettre="J8";
	else if(lettre=="K" && parseInt(qualite)<=8)
		lettre="K<=8";
	else if(lettre=="K")
		lettre="K>8";
	else if(lettre=="M" && parseInt(qualite)<=8)
		lettre="M<=8";
	else if(lettre=="M")
		lettre="M>8";
	else if(lettre=="N" && parseInt(qualite)<=8)
		lettre="N<=8";
	else if(lettre=="N")
		lettre="N>8";


	if(lettre!=lettre_originale)
		debug("	-> Lettre '"+lettre_originale+"' transformées en '"+lettre+"'");

	if((lettre=="A" || lettre=="B") && diametre<=1)
	{
		debug("	/!\\ Les arbres tolérancés 'A' et 'B' sont prévus qu'au-delà de 1mm");
		ES="error";
		EI="error";
	}
	else if(lettre=="JS")
	{
		debug("	-> JS = cote centrée");
		if(parseInt(qualite)>=7 && parseInt(qualite)<=11 && IT%2==1)//Pour les IT impaire, pour les qualité 7 a 11...
		{
			IT=Math.floor(IT/2)*2;//...On l'arrondi à l'entier pair immédiatement inférieur
			debug("  -> IT modifié : "+String(IT)+" (7<=qualite<=11 et IT impaire)");
		}
		ES=IT*0.001/2;
		EI=-IT*0.001/2;
		debug("  -> ES : "+String(IT/2));
		debug("  -> EI : "+String(-IT/2));
	}
	else if(lettre=="K<=8" || lettre=="M<=8" || lettre=="N<=8")
	{
		debug(" -> Cas "+lettre_originale+" et qualité <=8");
		var borneSup=borneSupAlesage[lettre][i];
		if(parseInt(qualite)>=3)
		{
			var D=Delta[qualite][i];
			debug("  -> Delta="+String(D));
			ES=(borneSup+D)*0.001;
			EI=ES-IT*0.001;
			debug("  -> ES : "+String(borneSup+D)+"  = "+String(borneSup)+"+"+String(D));
			debug("  -> EI : "+String(-IT/2));
		}
		else
		{
			debug("	/!\\ Le Delta n'existe pas pour cette qualité.");
			ES="error";
			EI="error";
		}
	}
	else if(lettre=="P" || lettre=="R" || lettre=="S" || lettre=="T" || lettre=="U" || lettre=="V" || lettre=="X" || lettre=="Y" || lettre=="Z" || lettre=="ZA" || lettre=="ZB" || lettre=="ZC")
	{
		debug("	-> Cas des lettres >='P'");

		var borneSup=borneSupAlesage[lettre+">7"][i];
		if(borneSup!="-")
		{
			if(parseInt(qualite)>7)
			{
				debug("	-> Cas : Qualité >7");
				ES=borneSup*0.001;
				EI=ES-IT*0.001;
				debug("	-> ES : "+borneSup+" (qualite>7)");
				debug("	-> EI : "+(borneSup-IT));
			}
			else if(parseInt(qualite)>=3)
			{
				debug("	-> Cas : Qualité <=7");
				var D=Delta[qualite][i];
				debug("	-> Delta="+D);
				ES=(borneSup+D)*0.001;
				EI=ES-IT*0.001;
				debug("	-> ES : "+(borneSup+D)+"   ="+borneSup+"+"+D);
				debug("	-> EI : "+(borneSup+D-IT));
			}
			else
			{
				debug("	/!\\ Le Delta n'existe pas pour cette qualité.");
				ES="error";
				EI="error";
			}
		}
		else
		{
			debug("	/!\\ La borne sup n'existe pas pour la qualité demandée.");
			ES="error";
			EI="error";
		}
	}
	else if(lettre=="K<=8")
	{
		var borneSup=borneSupAlesage[lettre][i];
		debug("	-> Cas : K<=8");
		if(parseInt(qualite)>=3)
		{
			var D=Delta[qualite][i];
			debug("	-> Delta="+D);
			ES=(borneSup+D)*0.001;
			EI=ES-IT*0.001;
			debug("	-> ES : "+(borneSup+D)+"   ="+borneSup+"+"+D);
			debug("	-> EI : "+(borneSup-IT));
		}
		else
		{
			debug("	/!\\ Le Delta n'existe pas pour cette qualité.");
			ES="error";
			EI="error";
		}
	}
	else if(isset(borneInfAlesage[lettre]))//Si la lettre est <= à JS
	{	
		debug("	-> Cas des lettres <='JS'");
		var borneInf=borneInfAlesage[lettre][i];
		if(borneInf!="-" && borneInf!=undefined)
		{
			EI=borneInf*0.001;
			ES=EI+IT*0.001;
			debug("	-> EI : "+(borneInf));
			debug("	-> ES : "+(borneInf+IT));
		}
		else
		{
			debug("	/!\\ La borne inf n'existe pas pour la qualité demandée.");
			ES="error";
			EI="error";
		}
	}
	else if(isset(borneSupAlesage[lettre]))//Si la lettre est > à JS
	{
		debug("	-> Cas des lettres > 'JS'");
		var borneSup=borneSupAlesage[lettre][i];
		if(borneSup!="-" && borneSup!=undefined)
		{
			ES=borneSup*0.001;
			EI=ES-IT*0.001;
			debug("	-> ES : "+(borneSup));
			debug("	-> ES : "+(borneSup-IT));
		}
		else
		{
			debug("	/!\\ La borne sup n'existe pas pour la qualité demandée.");
			ES="error";
			EI="error";
		}
	}
	else	//si on ne le trouve pas dans le tableau
	{
		debug("	/!\\ La cote ne correspond à rien dans le tableau de valeurs.");
			ES="error";
			EI="error";
	}

	return {"nominal":diametre,"EI":EI,"ES":ES,"lettre":lettre_originale,"qualite":qualite};
}

//=============================================================================================
function updateVariables(reponse)
{
	a=reponse;
	ALESAGE.nominal=reponse.nominal;
	ALESAGE.EI=reponse.alesage.EI;
	ALESAGE.ES=reponse.alesage.ES;
	ALESAGE.borne_inf=reponse.nominal+reponse.alesage.EI;
	ALESAGE.borne_sup=reponse.nominal+reponse.alesage.ES;
	ALESAGE.IT=reponse.alesage.ES+(-reponse.alesage.EI);
	ALESAGE.moyenne=reponse.nominal+(reponse.alesage.ES+reponse.alesage.EI)/2;
	ALESAGE.lettre=reponse.alesage.lettre;
	ALESAGE.qualite=reponse.alesage.qualite;

	ARBRE.nominal=reponse.nominal;
	ARBRE.EI=reponse.arbre.EI;
	ARBRE.ES=reponse.arbre.ES;
	ARBRE.borne_inf=reponse.nominal+reponse.arbre.EI;
	ARBRE.borne_sup=reponse.nominal+reponse.arbre.ES;
	ARBRE.IT=reponse.arbre.ES-reponse.arbre.EI;
	ARBRE.moyenne=reponse.nominal+(reponse.arbre.ES+reponse.arbre.EI)/2;
	ARBRE.lettre=reponse.arbre.lettre;
	ARBRE.qualite=reponse.arbre.qualite;

	MONTAGE.nominal=reponse.nominal;
	MONTAGE.jeu_max=ALESAGE.ES-ARBRE.EI;
	MONTAGE.jeu_min=ALESAGE.EI-ARBRE.ES;
}

function updateTableau()
{
	$("#resultat").show(200);

	$("#res_alesage_nominal").text(metEnFormeLongueurAvecUnite(ALESAGE.nominal));
	$("#res_alesage_EI").text("EI = "+metEnFormeLongueurAvecUnite(ALESAGE.EI,true));
	$("#res_alesage_ES").text("ES = "+metEnFormeLongueurAvecUnite(ALESAGE.ES,true));
	$("#res_alesage_borne_inf").text(metEnFormeLongueurAvecUnite(ALESAGE.borne_inf));
	$("#res_alesage_borne_sup").text(metEnFormeLongueurAvecUnite(ALESAGE.borne_sup));
	$("#res_alesage_IT").text(metEnFormeLongueurAvecUnite(ALESAGE.IT));
	$("#res_alesage_moyenne").text(metEnFormeLongueurAvecUnite(ALESAGE.moyenne));

	$("#res_arbre_nominal").text(metEnFormeLongueurAvecUnite(ARBRE.nominal));
	$("#res_arbre_EI").text("EI = "+metEnFormeLongueurAvecUnite(ARBRE.EI,true));
	$("#res_arbre_ES").text("ES = "+metEnFormeLongueurAvecUnite(ARBRE.ES,true));
	$("#res_arbre_borne_inf").text(metEnFormeLongueurAvecUnite(ARBRE.borne_inf));
	$("#res_arbre_borne_sup").text(metEnFormeLongueurAvecUnite(ARBRE.borne_sup));
	$("#res_arbre_IT").text(metEnFormeLongueurAvecUnite(ARBRE.IT));
	$("#res_arbre_moyenne").text(metEnFormeLongueurAvecUnite(ARBRE.moyenne));

	var texte_jeu_max="Jeu max. : ";
	if(MONTAGE.jeu_max<0) texte_jeu_max="Serrage min. : ";

	var texte_jeu_min="Jeu min. : ";
	if(MONTAGE.jeu_min<0) texte_jeu_min="Serrage max. : ";

	$("#jeu_max").text(texte_jeu_max+metEnFormeLongueurAvecUnite(MONTAGE.jeu_max));
	$("#jeu_min").text(texte_jeu_min+metEnFormeLongueurAvecUnite(MONTAGE.jeu_min));
}

function updateEntree()
{
	$("#form_nominal").val(ALESAGE.nominal);
	$("#form_qualite_alesage").val(ALESAGE.qualite);
	$("#form_qualite_arbre").val(ARBRE.qualite);
	$("#form_lettre_alesage").val(ALESAGE.lettre);
	$("#form_lettre_arbre").val(ARBRE.lettre);
}

function updateBornesManuelles()
{
	$("#bornes_manuelles_alesage_gauche .curseur_manuel").slider("values", 0,-ALESAGE.ES*1000);
	$("#bornes_manuelles_alesage_gauche .curseur_manuel").slider("values", 1,-ALESAGE.EI*1000);
	$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("values", 0,ALESAGE.EI*1000);
	$("#bornes_manuelles_alesage_droite .curseur_manuel").slider("values", 1,ALESAGE.ES*1000);
	
	$("#bornes_manuelles_arbre_gauche .curseur_manuel").slider("values", 0,-ARBRE.ES*1000);
	$("#bornes_manuelles_arbre_gauche .curseur_manuel").slider("values", 1,-ARBRE.EI*1000);
	$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("values", 0,ARBRE.EI*1000);
	$("#bornes_manuelles_arbre_droite .curseur_manuel").slider("values", 1,ARBRE.ES*1000);

	$("#form_nominal_bornes_manuelles").val(ARBRE.nominal);
	$("#bornes_manuelles_ecarts_alesage_nominal").text(ARBRE.nominal);
	$("#bornes_manuelles_ecarts_arbre_nominal").text(ARBRE.nominal);
	updageBornesNumeriquesInBonresManuelles();
	
	dessine_bornes_alesage();
	dessine_bornes_arbre();
}


function updageBornesNumeriquesInBonresManuelles()
{
	$("#bornes_manuelles_ecarts_alesage_sup").text(metEnFormeLongueurAvecUnite(ALESAGE.ES,true));
	$("#bornes_manuelles_ecarts_alesage_inf").text(metEnFormeLongueurAvecUnite(ALESAGE.EI,true));
	$("#bornes_manuelles_ecarts_arbre_sup").text(metEnFormeLongueurAvecUnite(ARBRE.ES,true));
	$("#bornes_manuelles_ecarts_arbre_inf").text(metEnFormeLongueurAvecUnite(ARBRE.EI,true));
}




function metEnFormeLongueurAvecUnite(l,signe)
{
	if(typeof(signe)=="undefined")
		signe=false;
	if(l=="error" || isNaN(l) || l==undefined)
		return "??";

	var unite="mm";
	if(Math.abs(l)<1)
		{
			l=l*1000;
			unite="µm";
		}

	l=Math.round(1000*l)/1000;//Arrondi

	if(signe && l>0)
		l="+"+l;

	return l+" "+unite;
}




function dessine_bornes_alesage()
{
	var coef_dessin=400/(2*getExageration());
	
	//Reset eventuel
	if(typeof stage_bornes_alesage!=="undefined")
	{stage_bornes_alesage.removeAllChildren();
	stage_bornes_alesage.update();}
	
	//Nouveau dessin
	stage_bornes_alesage = new createjs.Stage("dessin_bornes_manuelles_alesage_canvas");

	//Ecarts
	var liste_points_alesage_gauche=[];
	var liste_points_alesage_droite=[];
	var prec_gauche=0;
	var prec_droite=0;
	var nouveau_gauche=(Math.random()*ALESAGE.IT-ALESAGE.ES)*1000*coef_dessin;
	var nouveau_droite=(Math.random()*ALESAGE.IT+ALESAGE.EI)*1000*coef_dessin;
	for(var i=0;i<=20;i++)
	{
		prec_gauche=nouveau_gauche;
		prec_droite=nouveau_droite;
		var nouveau_gauche=(2*prec_gauche+(Math.random()*ALESAGE.IT-ALESAGE.ES)*1000*coef_dessin)/3;
		var nouveau_droite=(2*prec_droite+(Math.random()*ALESAGE.IT+ALESAGE.EI)*1000*coef_dessin)/3;
		liste_points_alesage_gauche.push(nouveau_gauche);
		liste_points_alesage_droite.push(nouveau_droite);
	}
	
	//Fond
		var coupe_alesage=new createjs.Shape();	
		coupe_alesage.graphics.setStrokeStyle(5).beginFill("gray").drawRoundRect(0,0,800,200,20);
		stage_bornes_alesage.addChild(coupe_alesage);


	//alesage
		var fond_alesage=new createjs.Shape();
		//coté gauche
		fond_alesage.graphics.beginFill("white");
		fond_alesage.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES+liste_points_alesage_gauche[0],0);
		for(var i=1;i<liste_points_alesage_gauche.length;i++)
		{
			fond_alesage.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES+liste_points_alesage_gauche[i],10*i);
		}		
		//cote droite
		fond_alesage.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+liste_points_alesage_droite[liste_points_alesage_droite.length-1],10*(liste_points_alesage_droite.length-1));
		for(var i=liste_points_alesage_droite.length-2;i>=0;i--)
		{
			fond_alesage.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+liste_points_alesage_droite[i],10*i);
		}
		
		stage_bornes_alesage.addChild(fond_alesage);

	//Lignes bord alesage

		var lignes_alesage = new createjs.Shape();	
		//coté gauche
		lignes_alesage.graphics.setStrokeStyle(3).beginStroke("#000000");
		lignes_alesage.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES+liste_points_alesage_gauche[0],0);
		for(var i=1;i<liste_points_alesage_gauche.length;i++)
		{
			lignes_alesage.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES+liste_points_alesage_gauche[i],10*i);
		}
				
		//cote droite
		lignes_alesage.graphics.moveTo(400+RAYON_NOMINAL_BORNES_MANUELLES+liste_points_alesage_droite[liste_points_alesage_droite.length-1],10*(liste_points_alesage_droite.length-1));
		for(var i=liste_points_alesage_droite.length-2;i>=0;i--)
		{
			lignes_alesage.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+liste_points_alesage_droite[i],10*i);
		}
		
		stage_bornes_alesage.addChild(lignes_alesage);
		
	//Axe
		var axe=new createjs.Shape();
		axe.graphics.setStrokeStyle(3).beginStroke("#000000").setStrokeDash([20,10,10,10]);
		axe.graphics.moveTo(400,-20);
		axe.graphics.lineTo(400,220);
		stage_bornes_alesage.addChild(axe);
		
		
	//bornes
		var limites=new createjs.Shape();
		limites.graphics.setStrokeStyle(2).beginStroke("green").setStrokeDash([10,10]);
		limites.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES-(ALESAGE.ES)*1000*coef_dessin,0);
		limites.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES-(ALESAGE.ES)*1000*coef_dessin,200);
		limites.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES-(ALESAGE.EI)*1000*coef_dessin,0);
		limites.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES-(ALESAGE.EI)*1000*coef_dessin,200);
		limites.graphics.moveTo(400+RAYON_NOMINAL_BORNES_MANUELLES+(ALESAGE.ES)*1000*coef_dessin,0);
		limites.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+(ALESAGE.ES)*1000*coef_dessin,200);
		limites.graphics.moveTo(400+RAYON_NOMINAL_BORNES_MANUELLES+(ALESAGE.EI)*1000*coef_dessin,0);
		limites.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+(ALESAGE.EI)*1000*coef_dessin,200);
		stage_bornes_alesage.addChild(limites);
		
	//Nominal
		var borne_nominale=new createjs.Shape();
		borne_nominale.graphics.setStrokeStyle(2).beginStroke("red").setStrokeDash([2,4]);
		borne_nominale.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES,0);
		borne_nominale.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES,200);
		borne_nominale.graphics.moveTo(400+RAYON_NOMINAL_BORNES_MANUELLES,0);
		borne_nominale.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES,200);
		stage_bornes_alesage.addChild(borne_nominale);


	//Contour Fond
		var contour_fond_alesage=new createjs.Shape();	
		contour_fond_alesage.graphics.setStrokeStyle(5).beginStroke("#000000").drawRoundRect(0,0,800,200,20);
		stage_bornes_alesage.addChild(contour_fond_alesage);

	//Update
	stage_bornes_alesage.update();
}




function dessine_bornes_arbre()
{
	var coef_dessin=400/(2*getExageration());
	
	//Reset eventuel
	if(typeof stage_bornes_arbre!=="undefined")
	{stage_bornes_arbre.removeAllChildren();
	stage_bornes_arbre.update();}
	
	//Nouveau dessin
	stage_bornes_arbre = new createjs.Stage("dessin_bornes_manuelles_arbre_canvas");

	//Ecarts
	var liste_points_arbre_gauche=[];
	var liste_points_arbre_droite=[];
	var prec_gauche=0;
	var prec_droite=0;
	var nouveau_gauche=(Math.random()*ARBRE.IT-ARBRE.ES)*1000*coef_dessin;
	var nouveau_droite=(Math.random()*ARBRE.IT+ARBRE.EI)*1000*coef_dessin;
	for(var i=0;i<=20;i++)
	{
		prec_gauche=nouveau_gauche;
		prec_droite=nouveau_droite;
		nouveau_gauche=(2*prec_gauche+(Math.random()*ARBRE.IT-ARBRE.ES)*1000*coef_dessin)/3;
		nouveau_droite=(2*prec_droite+(Math.random()*ARBRE.IT+ARBRE.EI)*1000*coef_dessin)/3;
		liste_points_arbre_gauche.push(nouveau_gauche);
		liste_points_arbre_droite.push(nouveau_droite);
	}
	
	//arbre
		var fond_arbre=new createjs.Shape();
		//coté gauche
		fond_arbre.graphics.setStrokeStyle(3).beginStroke("#000000").beginFill("gray");
		fond_arbre.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES+liste_points_arbre_gauche[0],0);
		for(var i=1;i<liste_points_arbre_gauche.length;i++)
		{
			fond_arbre.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES+liste_points_arbre_gauche[i],10*i);
		}		
		//cote droite
		fond_arbre.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+liste_points_arbre_droite[liste_points_arbre_droite.length-1],10*(liste_points_arbre_droite.length-1));
		for(var i=liste_points_arbre_droite.length-2;i>=0;i--)
		{
			fond_arbre.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+liste_points_arbre_droite[i],10*i);
		}
		
		stage_bornes_arbre.addChild(fond_arbre);

	//Lignes bord arbre

		var lignes_arbre = new createjs.Shape();	
		//coté gauche
		lignes_arbre.graphics.setStrokeStyle(3).beginStroke("#000000");
		lignes_arbre.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES+liste_points_arbre_gauche[0],0);
		for(var i=1;i<liste_points_arbre_gauche.length;i++)
		{
			lignes_arbre.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES+liste_points_arbre_gauche[i],10*i);
		}
				
		//cote droite
		lignes_arbre.graphics.moveTo(400+RAYON_NOMINAL_BORNES_MANUELLES+liste_points_arbre_droite[liste_points_arbre_droite.length-1],10*(liste_points_arbre_droite.length-1));
		for(var i=liste_points_arbre_droite.length-2;i>=0;i--)
		{
			lignes_arbre.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+liste_points_arbre_droite[i],10*i);
		}
		
		stage_bornes_arbre.addChild(lignes_arbre);
		
	//Axe
		var axe=new createjs.Shape();
		axe.graphics.setStrokeStyle(3).beginStroke("#000000").setStrokeDash([20,10,10,10]);
		axe.graphics.moveTo(400,-20);
		axe.graphics.lineTo(400,220);
		stage_bornes_arbre.addChild(axe);
		
		
	//bornes
		var limites=new createjs.Shape();
		limites.graphics.setStrokeStyle(2).beginStroke("green").setStrokeDash([10,10]);
		limites.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES-(ARBRE.ES)*1000*coef_dessin,0);
		limites.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES-(ARBRE.ES)*1000*coef_dessin,200);
		limites.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES-(ARBRE.EI)*1000*coef_dessin,0);
		limites.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES-(ARBRE.EI)*1000*coef_dessin,200);
		limites.graphics.moveTo(400+RAYON_NOMINAL_BORNES_MANUELLES+(ARBRE.ES)*1000*coef_dessin,0);
		limites.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+(ARBRE.ES)*1000*coef_dessin,200);
		limites.graphics.moveTo(400+RAYON_NOMINAL_BORNES_MANUELLES+(ARBRE.EI)*1000*coef_dessin,0);
		limites.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES+(ARBRE.EI)*1000*coef_dessin,200);
		stage_bornes_arbre.addChild(limites);
		
	//Nominal
		var borne_nominale=new createjs.Shape();
		borne_nominale.graphics.setStrokeStyle(2).beginStroke("red").setStrokeDash([2,4]);
		borne_nominale.graphics.moveTo(400-RAYON_NOMINAL_BORNES_MANUELLES,0);
		borne_nominale.graphics.lineTo(400-RAYON_NOMINAL_BORNES_MANUELLES,200);
		borne_nominale.graphics.moveTo(400+RAYON_NOMINAL_BORNES_MANUELLES,0);
		borne_nominale.graphics.lineTo(400+RAYON_NOMINAL_BORNES_MANUELLES,200);
		stage_bornes_arbre.addChild(borne_nominale);

	//Update
	stage_bornes_arbre.update();
}






//=============================================================
function findNearestQualite(IT,diametre)
{
	var iDiam=findBorneDiametre(diametre);//On trouve le diametre
	var ecart=1e10;
	var qMeilleur=0;
	for(var q in ITQ)//Pour chaque qualite
	{
		var e=Math.abs(IT-parseInt(ITQ[q][iDiam]));
		if(e<ecart)
		{
			ecart=e;
			qMeilleur=q;
		}
	}
	return parseInt(qMeilleur);
}

//borneInf=valeur,IT=valeur,diametre=Valeur,arbre=boolean (true si on cherche un arbre)
function findNearesLettre(borneInf,borneSup,qualite,diametre,arbre)
{
	var ecartMeilleur=1e10;
	var iMeilleur=0;
	var lettreMeilleure;
	for(var iLettre in listeLettres)
	{
		var lettre=listeLettres[iLettre];
		if(!arbre) lettre=lettre.toUpperCase();
		var bornes=getBornes(diametre,lettre,qualite);
		var ecart=Math.sqrt(Math.pow(bornes.EI*1000-borneInf,2)+Math.pow(bornes.ES*1000-borneSup,2));
		if(ecart<ecartMeilleur)
		{
			ecartMeilleur=ecart;
			iMeilleur=iLettre;
			lettreMeilleure=lettre;
		}
	}

	return lettreMeilleure;
}




//==================================
function getExageration()
{
	var value=-$("#bornes_manuelles_exageration_curseur").slider("value");
	value=Math.pow(10,value);
	return value;
}
