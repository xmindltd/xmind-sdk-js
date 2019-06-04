import { Workbook } from './core/workbook';
import { Topic } from './core/topic';
import { Marker } from './core/marker';
import { Dumper } from './utils/dumper';
import { extend } from 'lodash';

// In browser, window === global
extend(global, { Workbook, Topic, Marker, Dumper });
