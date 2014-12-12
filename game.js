enchant();
window.onload = function() {
	var game = new Game(320,320);
	var touch = 0; //circle用タッチ判定
	var touchs = 0; //スタート用タッチ判定
	var touchn = 0; //次ステージ遷移用タッチ判定
	var rc = 5; //circle半径
	var cnt = 0; //circle用カウント
	var circle = new Sprite(100,100);
	var csurface = new Surface(100,100);
	var ex; //circle生成座標
	var ey;
	var ball = Array(40);
	var bsurface = Array(40);
	var rb = Array(40); //ball半径配列
	var cntb = Array(40); //ball用カウント配列
	var r = Array(40); //ball用rgb値配列
	var g = Array(40);
	var b = Array(40);
	var n = 0; //gameover判定用変数
	var score = 0; //ステージスコア
	var scoreLabel = new Label(0);
	scoreLabel.font = "24px 'Arial Black'";
	scoreLabel.x = 220;
	scoreLabel.y = 250;
	var totalscore = 0; //トータルスコア
	var TotalScoreLabel = new Label('000');
	TotalScoreLabel.font = "20px 'Arial Black'";
	TotalScoreLabel.x = 5;
	TotalScoreLabel.y = 0;
	var clearscore = 0; //クリアスコア
	var ClearScoreLabel = new Label(0);
	ClearScoreLabel.font = "20px 'Arial Black'";
	ClearScoreLabel.x = 125;
	ClearScoreLabel.y = 100;
	var startScene = new Scene();
	var stageScene = new Scene();
	var bn = Array(10,20,30,40,100); //ステージ設定：ボール数、クリア条件
	var clear = Array(2,5,15,30,100);　//1:2/10,2:5/20,3:15/30,4:30/40,5:100/100
	var stage = 1; //現ステージ
	var stageLabel = new Label(1)
	stageLabel.font = "24px 'Arial Black'";
	stageLabel.x = 105;
	stageLabel.y = 50;
	var missionLabel = new Label(1) //クリア条件ラベル
	missionLabel.font = "24px 'Arial Black'";
	missionLabel.x = 120;
	missionLabel.y = 100;
	var touchLabel = new Label('Touch or Click') //タッチorクリックを促すラベル
	touchLabel.font = "18px 'Arial Black'";
	touchLabel.x = 80;
	touchLabel.y = 200;
	var clearLabel = new Label('Clear!'); //クリアラベル
	clearLabel.font = "24px 'Arial Black'";
	clearLabel.x = 110;
	clearLabel.y = 50;
	var bg = new Sprite(320,320);
	var bgsurface = new Surface(320,320);
	var sc = new Sprite(320,320);
	var scsurface = new Surface(320,320);
	var scstart = new Sprite(320,320);
	var startsurface = new Surface(320,320);

	/* 変数n表示ラベル（デバッグ用）
	var nLabel = new Label('n='+n);
	clearLabel.font = "24px 'Arial Black'";
	clearLabel.x = 10;
	clearLabel.y = 10;
	*/

	for (var i=0; i<ball.length; i++){
		ball[i] = new Sprite(100,100);
		bsurface[i] = new Surface(100,100);
	}

	game.onload = function() {
		StartCreate(stage);
		//スタート画面
		game.pushScene(startScene);
	}
	//スタート画面生成
	function StartCreate(s){
		//背景
		bgsurface.context.fillStyle = "rgb(255,255,224)";
		bgsurface.context.fillRect(0,0,320,320);
		bg.image = bgsurface;
		startScene.addChild(bg);
		//ラベル
		if(s == 5){
			stageLabel.text = 'LastStage';
			stageLabel.x = 85;
			missionLabel.x = 100;
		}else{
			stageLabel.text = 'Stage'+s;
		}
		startScene.addChild(stageLabel);
		missionLabel.text = clear[s-1]+'/'+bn[s-1];
		startScene.addChild(missionLabel);
		startScene.addChild(touchLabel);
		//タッチ判定用スクリーン
		startsurface.context.fillStyle = "rgba(0,0,0,0)";
		startsurface.context.fillRect(0,0,320,320);
		scstart.image = scsurface;
		startScene.addChild(scstart);
		scstart.addEventListener('touchstart',function(){
			if(touchs == 0){
				touchs = 1;
				StageReset(s);
				StageCreate(s);
				touch = 0;
				startScene.removeChild(scstart);
				game.pushScene(stageScene);
			}
		});
	}
	//ステージ画面生成
	function StageCreate(s){
		//背景
		bgsurface.context.fillStyle = "rgb(240,248,255)";
		bgsurface.context.fillRect(0,0,320,320);
		bg.image = bgsurface;
		stageScene.addChild(bg);
		//ball生成
		BallCreate(s);
		//circle生成
		circle = new Sprite(100,100);
		csurface = new Surface(100,100);
		for (var i=0; i<bn[s-1]; i++){
			stageScene.addChild(ball[i]);
			//ballの動き
			ball[i].addEventListener('enterframe',function(){
				if (this.conf == 0) {
					this.x += this.vx;
					this.y += this.vy;
					if(this.y > game.width-50 || this.y < -50){
						this.vy = -this.vy;
					}
					if(this.x > game.height-50 || this.x < -50){
						this.vx = -this.vx;
					}
				} else{
					this.x = this.x;
					this.y = this.y;
				}
			});
			//ballが拡大→消えたときのイベント
			ball[i].addEventListener('removedfromscene',function(){
				n --;
				if(n == 0){
					if(s == 5){ //LastStageのとき
						if(score >= clear[s-1]){
							clearscore = 100;
							totalscore += clearscore;
							if(totalscore == 1000){
								clearLabel.text = 'PerfectClear!!';
							}else{
								clearLabel.text = 'LastStageClear!!';
							}
							clearLabel.x = 70;
							stageScene.addChild(clearLabel);
							ClearScoreLabel.text = '+'+clearscore;
							stageScene.addChild(ClearScoreLabel);
							stageScene.addChild(touchLabel);
							if(totalscore < 10){
								TotalScoreLabel.text = '00'+totalscore;
							}else if(totalscore < 100){
								TotalScoreLabel.text = '0'+totalscore;
							}else{
								TotalScoreLabel.text = totalscore;
							}
							touchn = 0;
							sc.addEventListener('touchstart',function(){
								if(touchn == 0){
									touchn = 1;
									if(totalscore == 1000){
										game.end(totalscore, "PerfectClear!! score:"+totalscore);
									}else{
										game.end(totalscore, "LastStageClear!! score:"+totalscore);
									}
								}
							});
						}else{
							game.end(totalscore, "Stage4Clear! score:"+totalscore);
						}
					}else{
						if(score >= clear[s-1]){
							clearscore = 10*stage;
							stageScene.addChild(clearLabel);
							ClearScoreLabel.text = '+'+clearscore;
							stageScene.addChild(ClearScoreLabel);
							stageScene.addChild(touchLabel);
							totalscore += clearscore;
							if(totalscore < 10){
								TotalScoreLabel.text = '00'+totalscore;
							}else if(totalscore < 100){
								TotalScoreLabel.text = '0'+totalscore;
							}else{
								TotalScoreLabel.text = totalscore;
							}
							stage ++;
							touchs = 0;
							touchn = 0;
							sc.addEventListener('touchstart',function(){
								if(touchn == 0){
									touchn = 1;
									StartCreate(stage);
									game.pushScene(startScene);
								}
							});
						}else if(s == 1){
							stage --;
							game.end(totalscore, "Not Clear! score:"+totalscore);
						}else{
							stage --;
							game.end(totalscore, "Stage"+stage+"Clear! score:"+totalscore);
						}
					}
				}
			});
		}
		//scoreラベル
		scoreLabel.text  = score+'/'+bn[s-1];
		stageScene.addChild(scoreLabel);
		//totalscoreラベル
		stageScene.addChild(TotalScoreLabel);
		//circle用タッチ判定スクリーン
		scsurface.context.fillStyle = "rgba(0,0,0,0)";
		scsurface.context.fillRect(0,0,320,320);
		sc.image = scsurface;
		stageScene.addChild(sc);
		//circle用タッチ判定
		sc.addEventListener('touchstart',function(e){
			if(touch == 0){
				ex = e.x;
				ey = e.y;
				touch = 1;

				CircleDraw();
				circle.x = ex-50;
				circle.y = ey-50;
				circle.image = csurface;
				stageScene.addChild(circle);
			}
		});
		//circleのイベント
		circle.addEventListener('enterframe',function(){
			CircleScale(s);
		});
		circle.addEventListener('removedfromscene',function(){
			if(n == 0){
				game.end(score, score+"連鎖！");
			}
		});
	}
	//ball生成
	function BallCreate(s){
		for (var i=0; i<bn[s-1]; i++){
			ball[i] = new Sprite(100,100);
			bsurface[i] = new Surface(100,100);
			rb[i] = 5;
			r[i] = Math.floor(Math.random()*256);
			g[i] = Math.floor(Math.random()*256);
			b[i] = Math.floor(Math.random()*256);
			BallDraw(i);
			ball[i].image = bsurface[i];
			ball[i].x = Math.floor(Math.random()*270);
			ball[i].y = Math.floor(Math.random()*270);
			ball[i].vx = Math.floor(Math.random()*4)-2;
			if (ball[i].vx == 0) ball[i].vx = 2;
			ball[i].vy = 2/ball[i].vx;
			ball[i].conf = 0;
			cntb[i] = 0;
		}
	}
	//circleを描く
	function CircleDraw(){
		csurface.context.fillStyle = "rgba(169,169,169,0.6)";
		csurface.context.beginPath();
		csurface.context.arc(50,50,rc,0,Math.PI*2,true);
		csurface.context.fill();
	}
	//ballを描く
	function BallDraw(i){
		bsurface[i].context.fillStyle = "rgba("+r[i]+","+g[i]+","+b[i]+",0.6)";
		bsurface[i].context.beginPath();
		bsurface[i].context.arc(50,50,rb[i],0,Math.PI*2,true);
		bsurface[i].context.fill();
	}
	//circleの拡大縮小
	function CircleScale(s){
		if(cnt < 20){
			csurface.context.clearRect(0,0,100,100);
			CircleDraw();
			rc ++;
			cnt ++;
		}else if(cnt < 60){
			cnt ++;
		}else if(rc < 0){
			scoreLabel.text  = score+'/'+bn[stage-1];
			stageScene.removeChild(circle);
		}else{
			csurface.context.clearRect(0,0,100,100);
			CircleDraw();
			rc --;
			cnt ++;
		}
		for (var i=0; i < bn[s-1]; i++) {
				if (circle.within(ball[i],rc+rb[i])){
					BallScaleStart(i);
				}

			}
	}
	//ballの拡大縮小開始（スコア処理）
	function BallScaleStart(i){
		if(ball[i].conf == 0){
			ball[i].conf = 1;
			score ++;
			n ++;
			scoreLabel.text  = score+'/'+bn[stage-1];
			totalscore += 1*stage;
			if(totalscore < 10){
				TotalScoreLabel.text = '00'+totalscore;
			}else if(totalscore < 100){
				TotalScoreLabel.text = '0'+totalscore;
			}else{
				TotalScoreLabel.text = totalscore;
			}
			if(score >= clear[stage-1]){
				bgsurface.context.fillStyle = "rgb(224,255,255)";
				bgsurface.context.fillRect(0,0,320,320);
			}
			ball[i].addEventListener('enterframe',function(){
				BallScale(i);
				for (var j=0; j < bn[stage-1]; j++) {
				if (this.within(ball[j],rb[i]+rb[j])){
					BallScaleStart(j);
				}
			}
			});
		}
	}
	//ballの拡大縮小
	function BallScale(i){
		if(cntb[i] < 20){
			bsurface[i].context.clearRect(0,0,100,100);
			BallDraw(i);
			rb[i] ++;
			cntb[i] ++;
		}else if(cntb[i] < 60){
			cntb[i] ++;
		}else if(rb[i] < 0){
			stageScene.removeChild(ball[i]);
		}else{
			bsurface[i].context.clearRect(0,0,100,100);
			BallDraw(i);
			rb[i] --;
			cntb[i] ++;
		}
	}
	//ステージリセット
	function StageReset(s){
		//変数のリセット
		score = 0;
		cnt = 0;
		rc = 5;
		//オブジェクトの削除
		for (var i=0; i<bn[s-1]; i++){
			stageScene.removeChild(ball[i]);
			rb[i] = 5;
			cntb[i] = 0;
		}
		n = 0;
	}

	game.start();
}
