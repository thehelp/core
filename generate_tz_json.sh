# the second items on the line are the 'real zones' behind the aliases, which are the first on the line.
# really would have thought that the tool would pull those in for us...

LIB=dist/tz/

node node_modules/timezone-js/src/node-preparse.js ${LIB} \
 "Pacific/Pago_Pago \
, US/Aleutian, America/Adak \
, US/Hawaii, Pacific/Honolulu \
, US/Alaska, America/Anchorage \
, Pacific/Gambier \
, US/Pacific, America/Los_Angeles \
, Pacific/Pitcairn \
, US/Mountain, America/Denver \
, US/Arizona, America/Phoenix \
, US/Central, America/Chicago \
, America/Costa_Rica \
, US/Eastern, America/New_York \
, EST \
, Canada/Atlantic, America/Halifax \
, Brazil/West, America/Manaus \
, Brazil/East, America/Sao_Paulo \
, Atlantic/Stanley \
, America/Noronha \
, Atlantic/Azores \
, Atlantic/Cape_Verde \
, Europe/London \
, UTC, Etc/UTC \
, Europe/Rome \
, Africa/Algiers \
, Europe/Istanbul \
, Africa/Cairo \
, Africa/Asmara \
, Asia/Baku \
, Asia/Dubai \
, Indian/Maldives \
, Asia/Almaty \
, Asia/Bangkok \
, Australia/West, Australia/Perth \
, Asia/Tokyo \
, Australia/Sydney \
, Pacific/Guam \
, Asia/Vladivostok \
, Pacific/Auckland \
, Asia/Kamchatka \
, Pacific/Enderbury \
, Pacific/Kiritimati" \
 > ${LIB}min.json

node node_modules/timezone-js/src/node-preparse.js ${LIB} > ${LIB}all.json
