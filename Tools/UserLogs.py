# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

#!/usr/bin/Python-2.7.11

# Authors of this page : Victor Dupuy

import logging

#--- We first get the UserAccess loggers ---#
UserAccessVerbose = logging.getLogger('UserAccessVerbose')
UserAccessSimple = logging.getLogger('UserAccessSimple')

#--- Then we define functions to pass it some messages---#
def add(userName, IPAdress, userInteraction, dataSource, tableNames):
    log1 = IPAdress + ' : ' + userName + ' ' + userInteraction
    log2 = 'Data comes from : '+ dataSource
    log3 = 'Tables are ' + str(tableNames)

    UserAccessSimple.info(log1)
    UserAccessSimple.info(log2)
    UserAccessSimple.info(log3)
