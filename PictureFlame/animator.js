function Animator(head, foot, loop, maxStep){
    var auto_next_id = null;
    
    this.loopHeader = head;
    this.loopFooter = foot;
    this.loopCounter = loop;
    
    this.animation_step = -1;
    this.max_step = maxStep;
    
    this.auto_play = false;
    this.play_id = null;
}

Animator.prototype.run = function(){
    this.auto_play = true;
    this.play_id = setInterval(500, this.next_animation);
}

Animator.prototype.stop = function(){
    this.auto_play = false;
    clearInterval(this.play_id);
    this.play_id = null;    
}

Animator.prototype.next_animation = function(){
    if (this.animation_step >= 0){
	unhighlight_code(this.animation_step);
	for (var i = 0; i != operands.length; ++i){
	    operands[i].clear_select();
	}
    }
    
    if (this.animation_step == this.loopFooter){
          if (this.loopCounter != 0){  //skip to end of loop            
	      this.loopCounter -= 1;
	      this.animation_step = this.loopHeader;
          }          
          else
              this.animation_step += 1;
    }
    else if (this.animation_step == this.loopHeader){
	if (this.loopCounter == 0){
	    this.animation_step = this.loopFooter+1;

           //stop Animation
	    this.stop();
	   
	}
	else
            this.animation_step += 1;
    }
    else {  
	this.animation_step += 1;
    }
        highlight_code(this.animation_step);

    if (this.animation_step != this.loopHeader &&
	this.animation_step != this.loopFooter)
	interprete_code(this.animation_step);
}
    