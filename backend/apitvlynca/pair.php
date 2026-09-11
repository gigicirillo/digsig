<?php
$allowedOrigins = [
    'https://tv.lynca.it',
    'https://gigicirillo.github.io'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($origin && !in_array($origin, $allowedOrigins, true)) { http_response_code(403); echo json_encode(['error'=>'origin_not_allowed']); exit; }
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir) && !mkdir($dataDir, 0755, true)) { http_response_code(500); echo json_encode(['error'=>'data_directory_unavailable']); exit; }
$path = $dataDir . '/pairings.json';
function load_pairs($path){ if(!file_exists($path)) return []; $d=json_decode(file_get_contents($path),true); return is_array($d)?$d:[]; }
function save_pairs($path,$pairs){ return file_put_contents($path,json_encode($pairs,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE),LOCK_EX)!==false; }
function cleanup($pairs){ $now=time(); foreach($pairs as $k=>$v){ if(($v['expires']??0)<$now) unset($pairs[$k]); } return $pairs; }
$pairs=cleanup(load_pairs($path));
if($_SERVER['REQUEST_METHOD']==='GET'){
  $code=preg_replace('/\D/','',$_GET['code']??'');
  if(strlen($code)!==6 || !isset($pairs[$code])){ save_pairs($path,$pairs); http_response_code(404); echo json_encode(['error'=>'not_found']); exit; }
  $record=$pairs[$code]; save_pairs($path,$pairs); echo json_encode($record); exit;
}
if($_SERVER['REQUEST_METHOD']!=='POST'){ http_response_code(405); echo json_encode(['error'=>'method_not_allowed']); exit; }
$in=json_decode(file_get_contents('php://input'),true)?:[];
$action=$in['action']??'';
if($action==='request'){
  do{$code=str_pad((string)random_int(0,999999),6,'0',STR_PAD_LEFT);}while(isset($pairs[$code]));
  $pairs[$code]=['status'=>'pending','expires'=>time()+900];
  if(!save_pairs($path,$pairs)){ http_response_code(500); echo json_encode(['error'=>'write_failed']); exit; }
  echo json_encode(['code'=>$code,'expiresIn'=>900]); exit;
}
if($action==='claim'){
  $code=preg_replace('/\D/','',$in['code']??'');
  if(strlen($code)!==6 || !isset($pairs[$code]) || ($pairs[$code]['status']??'')!=='pending'){ http_response_code(404); echo json_encode(['error'=>'invalid_code']); exit; }
  $screen=$in['screen']??null;
  if(!is_array($screen) || empty($screen['id'])){ http_response_code(400); echo json_encode(['error'=>'invalid_screen']); exit; }
  $pairs[$code]=['status'=>'claimed','screenId'=>$screen['id'],'expires'=>time()+300];
  if(!save_pairs($path,$pairs)){ http_response_code(500); echo json_encode(['error'=>'write_failed']); exit; }
  echo json_encode(['ok'=>true,'screenId'=>$screen['id']]); exit;
}
http_response_code(400); echo json_encode(['error'=>'invalid_action']);