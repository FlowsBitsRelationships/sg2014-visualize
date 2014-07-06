var Timer = function($scope, $interval){
    var _self = this;
    var _keyframe_hash,
     _keyframe_callback,
    _timer_step = null;
    
    this.start = function( keyframes, keyframe_callback){
        _self = this;
        _keyframe_hash = _self.hashify_keyframes( keyframes );
        _keyframe_callback = keyframe_callback;
        
        _timer_step = null;
        $scope.get_endTime() 
        $scope.resetTimer();
        $scope.startTimer() 
    }
    
    this.hashify_keyframes = function (keyframes){        // Generate keyframe_hash that the Timer can call as needed to trigger events
        var keyframe_hash = {};
        keyframes.forEach(function(keyframe){
            keyframe_hash[keyframe.start] = keyframe;
        });
        return keyframe_hash
    }
    
    // Resets _timer_step to beginning
    $scope.resetTimer = function(){
       $interval.cancel(_timer_step);
        $scope.time=0;
    }
    
     // Begins/Resumes advancing _timer_step
    $scope.startTimer = function(){
    _timer_step = $interval(function(){
        // If there is a keyframe set to occur at this $scope.time, fire it off
        if ( $scope.time in _keyframe_hash ){
            _keyframe_callback(_keyframe_hash[$scope.time]);
        }
        var next_time = parseInt($scope.time)+100;
        // If there is time remaining, update
        if (next_time < $scope.endTime+1){
            $scope.time =  parseInt($scope.time)+100;
            $scope.updateSlider();
        }
        else{
        $scope.stopTimer();
        }
        }, 1);
    }
    
    // Pauses _timer_step
    $scope.stopTimer = function(){
        $interval.cancel(_timer_step);
    }
	
    // Updates millisecond readout on timer
    $scope.updateSlider = function() {
        var timePercentage =  (($scope.time - $scope.startTime)/($scope.endTime - $scope.startTime)*100)+"%"
        $scope.sliderStyle = { 'margin-left' :timePercentage};
    };
	
    $scope.get_endTime = function ( ){
        $scope.endTime = 0;
        for ( var key in  _keyframe_hash){
            $scope.time = _keyframe_hash[key].start+_keyframe_hash[key].duration;
            if( $scope.time > $scope.endTime ){ $scope.endTime = $scope.time;}
        }
    }
    
    return this
}