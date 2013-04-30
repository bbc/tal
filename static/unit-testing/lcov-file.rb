#single lcov entry - filename and array of line numbers/execution count pairs
class LCOVEntry
	def initialize( filename )
		@filename 			= filename
		@lineNumbers 		= []
		@numberOfExecutions	= []
	end

	#gets filename for this entry
	def getFilename
		return @filename
	end

	#adds line/execution pair to linenumber/exexution array
	def addLineExecution( lineNumber, numberOfExecutions )
		@lineNumbers.push( lineNumber );
		@numberOfExecutions.push( numberOfExecutions );
	end

	#outputs this entry in LCOV format
	def outputToLCOV
		lcovString = "SF:#{@filename}\n"
		@lineNumbers.each do |line|
			lcovString += "DA:#{line},#{@numberOfExecutions[ @lineNumbers.index( line ) ]}\n"
		end
		lcovString += "end_of_record\n"
		return lcovString;
	end

	#returns an array of any lines that have been executed more than zero time
	def nonZeroExecLines
		nonZeroExecutionsLines 	= [];
		lineIndex 				= 0;
		
		@numberOfExecutions.each do |execution|
			if( execution > 0 )
				nonZeroExecutionsLines.push( lineIndex )
			end
			lineIndex += 1
		end
		
		return nonZeroExecutionsLines;
	end

	#remove the lines listed in the lineNumbers array
	def removeLines( lineNumbers )
		lineNumbers.each do |ln|
			@lineNumbers.delete_at( ln );
			@numberOfExecutions.delete_at( ln );
		end
	end

end

#represents a whole LCOV file
class LCOVFile
	def initialize( pathToLCOV )
		@lcovEntries = []

		lcovFileContents 	= IO.read( pathToLCOV )
		lcovLines 			= lcovFileContents.split( "\n" )
		lineIndex			= 0;

		#iterate until we hit the last line
		until lineIndex == lcovLines.length do
			#this should be the filename record - split into annotation and actual filename
			fnRecord = lcovLines[ lineIndex ].split( ":" )

			#second entry should be filename
			fileName = fnRecord[ 1 ]
			lineIndex += 1

			lcovEntry = LCOVEntry.new( fileName );

			#iterate until we meet the end_of_record marker
			until lcovLines[ lineIndex ] == "end_of_record" do
				#split the line into the annotation and the line number/execution pair
				lcRecord 			= lcovLines[ lineIndex ].split( ":" )
				#split the line number/execution pair into seperate fields
				lcLineNumExecutions	= lcRecord[ 1 ].split( ",")

				#add the line number and execution to this lcov entry
				lcovEntry.addLineExecution( Integer( lcLineNumExecutions[ 0 ] ), Integer( lcLineNumExecutions[ 1 ] ) )
				lineIndex += 1
			end
			lineIndex += 1

			if( (!fileName.include? "script-tests") && (!fileName.include? "script/lib") && (!fileName.include? "script/devices/data") ) 
				@lcovEntries.push( lcovEntry );
			end
		end
	end

	#get the list of entries
	def getEntries
		return @lcovEntries
	end

	#find the lcov entry which matches the passed filename
	def findEntryByFilename( filename )
		@lcovEntries.each do |entry|
			if( entry.getFilename == filename )
				return entry;
			end
		end	
	end

	#subtracts a coverage baseline LCOV from the current LCOV
	def removeBaselineLCOV( baseLCov )
		baseLCov.getEntries.each do |baseEnt|
			ent = findEntryByFilename( baseEnt.getFilename )
			ent.removeLines( baseEnt.nonZeroExecLines )		
		end
	end

	#outputs the current LCOV data to a LCOV format file
	def outputToLCOV( pathToOutputFile )
		lcovString = ""

		@lcovEntries.each do |entry|
			lcovString += entry.outputToLCOV
		end

		File.open(pathToOutputFile, 'w') {|f| f.write(lcovString) }
	end
end
