import { Workbook } from './core/workbook';
import { Topic } from './core/topic';
import { Marker } from './core/marker';
import { Dumper } from './utils/dumper';

// In browser, window === global
Object.assign(global, { Workbook, Topic, Marker, Dumper });
