'use strict'

angular
    .module('angular-check-tckno', [])
    .factory('HelperService', HelperService)
    .directive('checkTckno', checkTckno)

function checkTckno (HelperService) {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      scope.$watch(attrs.ngModel, function (newValue, oldValue) {

        var _modelNameFull = attrs.checkTckno.split('.')

        var _modelScope = scope[_modelNameFull[0]][_modelNameFull[1]] ? scope[_modelNameFull[0]][_modelNameFull[1]] : scope[_modelNameFull[0]][_modelNameFull[1]] = {}

        var _error = false

        if (elm.val().length > 0 && elm.val().length !== 11) {
          _error = true
          _modelScope.message = 'TC Kimlik No 11 rakamdan oluşmalıdır.'
        }

        if (elm.val().substr(0, 1) === '0') {
          _error = true
          _modelScope.message = 'TC Kimlik No geçersizdir.'
        }

        if (elm.val().length > 9) {
          if (HelperService.tenthValue(elm.val()) != elm.val().substr(9, 1)) {
            _error = true
            _modelScope.message = 'TC Kimlik No geçersizdir.'
          }
        }

        if (elm.val().length === 11) {
          if (HelperService.getLastChar(elm.val()) !== String(elm.val()).substr(10, 1)) {
            _error = true
            _modelScope.message = 'TC Kimlik No geçersizdir.'
          }
        }

        if (_error === false && elm.val().length === 11) {
          _modelScope.message = 'TC Kimlik No kullanıma uygundur.'
        }

        _modelScope.valid = !_error
      })
    }
  }
}

function HelperService () {
  return {
    getLastChar: function getLastChar (val) {
      var _val = String(val)
      var _tpl = 0
      for (var i = 0; i < 10; i++) {
        _tpl += parseInt(_val.substr(i, 1))
      }
      var _tplStr = String(_tpl)
      var _tplLen = _tplStr.length
      var _tplLastChar = _tplStr.substr((_tplLen - 1), 1)
      return _tplLastChar
    },
    tenthValue: function tenthValue (_val) {
      var _returnValue
      var _tckn = _val.substr(0, 9)
      var _map = Array.prototype.map
      var _stringToArray = _map.call(_tckn, function (x) {
        return x.split('')
      })
      var _stringToArrayObj = JSON.parse('[' + _stringToArray + ']')
      var _oddNumberTotal = 0
      var _evenNumberTotal = 0
      var _tenthValue = _stringToArrayObj.reduce(function (previousValue, currentValue, currentIndex, array) {
        if (currentIndex % 2 == 0) { 
          _oddNumberTotal = parseInt(_oddNumberTotal) + parseInt(currentValue)
        } else { 
          _evenNumberTotal = parseInt(_evenNumberTotal) + parseInt(currentValue)
        }
        if ((((_oddNumberTotal * 7) - _evenNumberTotal) % 10) < 0) {
          _returnValue = (((_oddNumberTotal * 7) - _evenNumberTotal) % 10) + 10
        } else {
          _returnValue = ((_oddNumberTotal * 7) - _evenNumberTotal) % 10
        }
        return _returnValue
      }, 0)
      return _tenthValue
    }
  }
}

