function Animator(head, foot, loop, maxStep){
    var auto_next_id = null;
    
    this.loopHeader = head;
    this.loopFooter = foot;
    this.loopCounter = loop;
    
    this.animation_step = -1;
    this.max_step = maxStep;
    
    this.auto_play = false;
    this.play_id = null;

    this.callback_fn = null;
}

Animator.prototype.run = function(callback){
    this.callback_fn = callback;
    this.auto_play = true;
    this.next_animation();
    this.play_id = setTimeout(next, 250);
}

Animator.prototype.stop = function(){
    this.auto_play = false;
    this.play_id = null;    

    this.callback_fn.apply();
}

Animator.prototype.next_animation = function(){
    //reset to default state    
    if (this.animation_step >= 0){
	unhighlight_code(this.animation_step);
	for (var i = 0; i != operands.length; ++i){
	    operands[i].clear_select();
	}
	if (this.auto_play)
	    this.play_id = setTimeout(next, 250);
    }
    
    //if we are at the end of a loop
    if (this.animation_step == this.loopFooter){

  	  //if there are more iterations, decrease loopCount and goto start of loop
          if (this.loopCounter != 0){ 
	      this.loopCounter -= 1;
	      this.animation_step = this.loopHeader;
          }          
          else  	  //otherwise just proceed to the next statement after the loop
              this.animation_step += 1;
    }
    else 
	//if we are at the start of the loop, then check if the loop needs to be executed
      if (this.animation_step == this.loopHeader){
	  //if loop counter is zero then skip to the end of the loop
	if (this.loopCounter == 0){
	    this.animation_step = this.loopFooter+1;

           //stop Animation
	    this.stop();
	   
	}
	else  //loop still needs to be executed so proceed
            this.animation_step += 1;
      }
      else {  //we are neither at the start nor at the end of the loop
	this.animation_step += 1;
      }

    if (this.animation_step < this.max_step){
        highlight_code(this.animation_step);

	if (this.animation_step != this.loopHeader &&
	    this.animation_step != this.loopFooter)
	    interprete_code(this.animation_step);
    }
}
    