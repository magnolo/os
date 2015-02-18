<?php
date_default_timezone_set('Europe/Paris'); 
require_once('../lib/tcpdf/config/lang/ger.php');
require_once('../lib/tcpdf/tcpdf.php');
ob_start();
$data = json_decode(file_get_contents('http://www.openscience.or.at/api/article/'.$_GET['id']));
if($data->parent_id != 0)
$data = json_decode(file_get_contents('http://www.openscience.or.at/api/article/'.$data->parent_id));
$children = json_decode(file_get_contents('http://www.openscience.or.at/api/article/'.$data->id.'/children'));
ob_end_clean();


switch($data->section->name){
	case "wissen":
		$color = "#A26FA7";
		$background = "#EDDCED";
		$dark = "#523C7C";
		break;
	case "projekte":
		$color = "#1da9c7";
		$background = "#8BCEDB";
		$dark = "#1DA9C7";
		break;
	case "schulcorner":
		$color = "#A26FA7";
		$background = "#EDDCED";
		$dark = "#523C7C";
		break;
	case "vol":
		$color = "#A26FA7";
		$background = "#EDDCED";
		$dark = "#523C7C";
		break;
	default:
		$color = "#112F56";
		$background = "#D2D9E3";
		$dark = "#442e74";
		break;
}
// Extend the TCPDF class to create custom Header and Footer
class MYPDF extends TCPDF {

    //Page header
    public function Header() {
        // Logo
		if($this->PageNO() == 1){
        $image_file = '../../images/logo_header.png';
        $this->Image($image_file, 10, 10, 50, '', 'PNG', '', 'T', false, 300, '', false, false, 0, false, false, false);
		}
        // Set font
       // $this->SetFont('helvetica', 'B', 20);
        // Title
        //$this->Cell(0, 15, '<< TCPDF Example 003 >>', 0, false, 'C', 0, '', 0, false, 'M', 'M');
    }

    // Page footer
    public function Footer() {
        // Position at 15 mm from bottom
        $this->SetY(-15);
        // Set font
		$this->SetFont('lettergothictextotlight', '', 9, '', false);
		$this->SetColor('text',160,160,160);
        // Page number
        $this->Cell(0, 10, 'Seite '.$this->getAliasNumPage().' von '.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }
}

$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Openscience.or.at');
$pdf->SetTitle($data->title);
$pdf->SetSubject($data->categorie->title);
$pdf->SetKeywords('');

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

//set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);

$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

//set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

//set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

//set some language-dependent strings
$pdf->setLanguageArray($l);

// ---------------------------------------------------------

// set font
$pdf->SetFont('conduit_itc', '', 10, '', false);


// add a page
$pdf->AddPage();

// set some text to print
/*$txt = <<<EOD
TCPDF Example 003

Custom page header and footer are defined by extending the TCPDF class and overriding the Header() and Footer() methods.
EOD;*/
$txt = '<br /><h1 style="font-weight:normal;background-color:'.$background.';color:'.$color.'">&nbsp;'.$data->title."</h1>";
$pdf->writeHTMLCell($w="",$h=0,$x=71,$y="",$txt, $border=0, $ln=1, $fill=0, $resetH=true,$align='L',$autopadding=true);
$y = $pdf->getY();
$txt = '<div style="font-size:9px;color:'.$color.'"><a style="color:'.$color.';text-decoration:none" href="http://www.openscience.or.at">OpenScience</a>&nbsp;>&nbsp;<a style="color:'.$color.';text-decoration:none"  href="http://www.openscience.or.at/'.$data->section->name.'">'.$data->section->title.'</a>&nbsp;>&nbsp;<a style="color:'.$color.';text-decoration:none" href="http://www.openscience.or.at/'.$data->section->name.'/'.$data->categorie->name.'">'.$data->categorie->title.'</a>&nbsp;>&nbsp;<a style="color:'.$color.';text-decoration:none"  href="http://www.openscience.or.at/'.$data->section->name.'/'.$data->categorie->name.'/'.$data->name.'">'.$data->title.'</a></div><br />';
$pdf->writeHTMLCell($w="",$h=0,$x=71,$y=$y-2,$txt, $border=0, $ln=1, $fill=0, $resetH=true,$align='L',$autopadding=true);

// print a block of text using Write() 
if($data->image->url): 
	if(strpos($data->image->url,'s_')):
		$img = "../../".substr($data->image->url,0,strrpos($data->image->url,"/")+1)."m_650_".substr($data->image->url,strrpos($data->image->url,"/")+7);
	 else:
		$img = "../../".$data->image->url;				
	 endif;

	$txt = '<img style="width:400px" src="'.$img.'" />';
	$txt .= '<div style="text-align:right;color:#888;font-size:8px">'.$data->image->source.'</div><br />';
	//$img = $pdf->Image($img, "", "", 50, '', '', '', 'T', false, 300, '', false, false, 0, false, false, false);
	$y = $pdf->getY();
	$pdf->writeHTMLCell($w=50,$h=0,$x="",$y=$y,$txt, $border=0, $ln=0, $fill=0, $resetH=false,$align='L',$autopadding=false);
endif; 
$pdf->SetFont('lettergothictextotlight', '', 11, '', false);
$txt = '<div style="color:#888888;">'.$data->text."</div>";
$pdf->writeHTMLCell($w=110,$h=0,$x=71,$y="",$txt, $border=0, $ln=1, $fill=0, $resetH=true,$align='L',$autopadding=false);


if(count($children) > 0){
	
	foreach($children as $child){
		if($pdf->getY() > 250)
			$pdf->AddPage();
		$pdf->SetFont('conduit_itc', '', 10, '', false);
		$txt = '<br /><h2 style="font-weight:normal;color:'.$dark.'">&nbsp;'.$child->title."</h2><br />";
		$pdf->writeHTMLCell($w=142,$h=0,$x=70,$y="",$txt, $border=0, $ln=1, $fill=0, $resetH=true,$align='L',$autopadding=true);
		
	// print a block of text using Write() 
		if($child->image->url): 
			if(strpos($child->image->url,'s_')):
				$img = "../../../".substr($child->image->url,0,strrpos($child->image->url,"/")+1)."m_650_".substr($child->image->url,strrpos($child->image->url,"/")+7);
			else:
				$img = "../../".$child->image->url;				
			endif;

			$txt = '<img style="width:400px;" src="'.$img.'" />';
			$txt .= '<div style="text-align:right;color:#888;font-size:8px">'.$data->image->source.'</div><br />';
			$pdf->writeHTMLCell($w=50,$h=0,$x="",$y=$y,$txt, $border=0, $ln=0, $fill=0, $resetH=false,$align='L',$autopadding=false);
			//$pdf->Image($img, "", "", 50, '', '', '', 'T', false, 300, '', false, false, 0, false, false, false);
		endif; 
		$pdf->SetFont('lettergothictextotlight', '', 11, '', false);
		$txt = '<div style="color:#888888;">'.$child->text."</div>";
		$pdf->writeHTMLCell($w=110,$h=0,$x=71,$y="",$txt, $border=0, $ln=1, $fill=0, $resetH=true,$align='L',$autopadding=false);
		
	}
}
// ---------------------------------------------------------

//Close and output PDF document
$pdf->Output($data->section->name."-".$data->categorie->name."-".$data->name.'.pdf', 'D');
