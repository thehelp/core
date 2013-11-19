set -e

BOWER=bower_components
LIB=lib/vendor/

echo "JQuery"
cp ${BOWER}/jquery/jquery.js ${LIB}
cp ${BOWER}/jquery/jquery.min.js ${LIB}

echo "JQuery"
cp ${BOWER}/jquery/jquery.js ${LIB}
cp ${BOWER}/jquery/jquery.min.js ${LIB}

echo "Lodash"
cp ${BOWER}/lodash/dist/lodash.compat.js ${LIB}/lodash.js
cp ${BOWER}/lodash/dist/lodash.compat.min.js ${LIB}/lodash.min.js

echo "Moment"
cp ${BOWER}/moment/moment.js ${LIB}
cp ${BOWER}/moment/min/moment.min.js ${LIB}

echo "RequireJS"
cp ${BOWER}/requirejs/require.js ${LIB}

echo "Timezone-JS (from node module)"
cp node_modules/timezone-js/src/date.js ${LIB}/timezone.js

echo ""
echo "success!"
