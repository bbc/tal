$setup = {};

if( ENV[ 'setup'] )
	pv "[INFO] Loading Setup From #{ENV[ 'setup' ]}"
	$setup = JSON.parse( IO.read( ENV[ 'setup'] ) )
end

def OptionArg( name, default )
	value = $setup[ name ] || ENV[ name ]
	return value ? "--#{name} #{value}" : default != nil ? "--#{name} #{default}" : "";
end

def SwitchArg( name )
	value = $setup[ name ] || ENV[ name ]
	return value ? "--#{name}" : ""
end

def PlainArg( name, default )
	value = $setup[ name ] || ENV[ name ]
	return value ? value : default;
end

#remove_lines - removes matching lines from newline delimited string
def remove_lines( text, exclude )
	lines_out  = "";
	line_array = text.split( "\n" );
	exclude.each do |x|
		line_array = line_array.find_all{ |i| i.index( x ) == nil }
	end

	line_array.each { |i| lines_out += ( i + "\n" )  }
	return lines_out
end