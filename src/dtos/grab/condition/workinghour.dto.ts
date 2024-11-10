import { Friday } from "./day/fri.dto";
import { Monday } from "./day/mon.dto";
import { Saturday } from "./day/sat.dto";
import { Sunday } from "./day/sun.dto";
import { Thursday } from "./day/thu.dto";
import { Tuesday } from "./day/tue.dto";
import { Wednesday } from "./day/wed.dto";

export class WorkingHour{
    sun: Sunday;
    mon: Monday;
    tue: Tuesday;
    wed: Wednesday;
    thu: Thursday;
    fri: Friday;
    sat: Saturday;
}