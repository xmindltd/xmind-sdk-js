import { Workbook } from './core/workbook';
import { Topic } from './core/topic';
import { Marker } from './core/marker';
import { Dumper } from './utils/dumper';
import { Loader } from './core/loader';

// In browser, window === global
Object.assign(global, { Workbook, Topic, Marker, Dumper, Loader });
