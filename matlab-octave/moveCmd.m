## Copyright (C) 2022 guill
##
## This program is free software: you can redistribute it and/or modify
## it under the terms of the GNU General Public License as published by
## the Free Software Foundation, either version 3 of the License, or
## (at your option) any later version.
##
## This program is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
## GNU General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with this program.  If not, see <https://www.gnu.org/licenses/>.

## -*- texinfo -*-
## @deftypefn {} {@var{retval} =} moveCmd (@var{input1}, @var{input2})
##
## @seealso{}
## @end deftypefn

## Author: guill <guill@DESKTOP-FCVG3BR>
## Created: 2022-09-13

function cmd = moveCmd (pos, speed, accel)

  %speed and accel are optionnal
  disp(nargin)
  if nargin < 3
    accel =   100;
  end
  if nargin < 2
    speed =   100;
  end

  pos = num2str(pos);
  speed = num2str(speed);
  accel = num2str(accel);

  %Cmd structure
  % ActuatorName=$<cmd_type>,<addr>,<pos>,<velocity>,<accel>*<checksum>
  cmd = ["$1,0," pos "," speed "," accel];
  chk = num2str(checksum(cmd));

  cmd = [cmd "*" chk]
  
endfunction
