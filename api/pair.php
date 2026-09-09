<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
$path = __DIR__ . '/../data/pairings.json';
function load_pairs($path){ if(!file_exists($path)) return []; $d=json_decode(file_get_contents($path),true); return is_array($d)?$d:[]; }
function save_pairs($path,$pairs){ file_put_contents($path,json_encode($pairs,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE),LOCK_EX); }
function cleanup($pairs){ $now=time(); foreach($pairs as $k=>$v){ if(($v['expires']??0)<$now) unset($pairs[$k]); } return $pairs; }
$pairs=cleanup(load_pairs($path));
if($_SERVER['REQUEST_METHOD']==='GET'){
  $code=preg_replace('/\D/','',$_GET['code']??'');
  if(strlen($code)!==6 || !isset($pairs[$code])){ http_response_code(404); echo json_encode(['error'=>'not_found']); save_pairs($path,$pairs); exit; }
  $record=$pairs[$code]; save_pairs($path,$pairs); echo json_encode($record); exit;
}
if($_SERVER['REQUEST_METHOD']!=='POST'){ http_response_code(405); echo json_encode(['error'=>'method_not_allowed']); exit; }
$in=json_decode(file_get_contents('php://input'),true)?:[];
$action=$in['action']??'';
if($action==='request'){
  do{$code=str_pad((string)random_int(0,999999),6,'0',STR_PAD_LEFT);}while(isset($pairs[$code]));
  $pairs[$code]=['status'=>'pending','expires'=>time()+900]; save_pairs($path,$pairs); echo json_encode(['code'=>$code,'expiresIn'=>900]); exit;
}
if($action==='claim'){
  $code=preg_replace('/\D/','',$in['code']??'');
  if(strlen($code)!==6 || !isset($pairs[$code]) || ($pairs[$code]['status']??'')!=='pending'){ http_response_code(404); echo json_encode(['error'=>'invalid_code']); exit; }
  $screen=$in['screen']??null; if(!is_array($screen) || empty($screen['id'])){ http_response_code(400); echo json_encode(['error'=>'invalid_screen']); exit; }
  $pairs[$code]=['status'=>'claimed','screenId'=>$screen['id'],'expires'=>time()+300]; save_pairs($path,$pairs); echo json_encode(['ok'=>true,'screenId'=>$screen['id']]); exit;
}
http_response_code(400); echo json_encode(['error'=>'invalid_action']);