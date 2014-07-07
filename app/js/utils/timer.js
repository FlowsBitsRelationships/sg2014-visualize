// FIXME: Timer needs to be more self contained (too dependent on external variables assigned outside the constructor)
// Timer should generate the correct timer html and assign all variables to the scope when it is constructed.
// In case multiple timers are desired...this may at some point benefit from redesign as an angular service that can be passed around
var Timer = function($scope, $interval){
    var _self = this;
    var _keyframe_hash,
     _keyframe_callback,
    _timer_step = null;
    
    $scope.time =0;
    $scope.startTime = 0;
    $scope.endTime = 240000;
        
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
        var next_time = parseInt($scope.time)+1000;
        // If there is time remaining, update
        if (next_time < $scope.endTime+1000){
            $scope.time =  parseInt($scope.time)+1000;
            $scope.updateSlider();
        }
        else{
        $scope.stopTimer();
        }
        }, 1000);
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