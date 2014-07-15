'use strict';

/* Directives */


var app_directives = angular.module('visualizeApp.directives', []);//.

var module = angular.module("test", []);
module.directive('treeview', function () {
    return {
        restrict: 'E',
        template: '<div class="sl-treeview"><ul class="clear" ng-transclude><treeview-item ng-repeat="item in items" item="item"></treeview-item></ul></div>',
        replace: true,
        transclude: true,
        scope: {},
        link: function (scope, element, attrs) {
            console.log("treeview directive loaded");
        },
        controller: function ($scope, $rootScope) {
            $rootScope.depth = 0;
            $scope.items = [
                { text: "face" },
                { text: "palm" },
                {
                    text: "cake",
                    childitems: [
                        { text: "1 face" },
                        { text: "1 palm", childitems: [
                            { text: "2 A"},
                            { text: "2 B"},
                            { text: "2 C"}
                        ]},
                        { text: "1 cake" }
                    ]
                }
            ];
        }
    };
});

module.directive('treeviewItem', function ($compile) {
    return {
        restrict: 'E',
        template: '<li><i class="icon-plus-sign"></i><a href="/"><i class="icon-folder-close"></i>{{item.text}}</a></li>',
        replace: true,
        scope: {
            item: "="
        },
        link: function (scope, element, attrs) {
            scope.$watch('item.childitems', function() {
                element.append($compile('<ul><treeview-item ng-repeat="childitem in item.childitems" item="childitem"></treeview-item></ul>')(scope));
            });
            console.log("treeview item directive loaded");
        }
    };
});