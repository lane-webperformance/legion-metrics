
[![Build Status](https://travis-ci.org/lane-webperformance/legion-metrics.svg?branch=master)](https://travis-ci.org/lane-webperformance/legion-metrics)
[![Dependency Status](https://gemnasium.com/badges/github.com/lane-webperformance/legion-metrics.svg)](https://gemnasium.com/github.com/lane-webperformance/legion-metrics)

Legion-metrics is a library to capture, merge, and summarize performance
metrics from a load test.

	var metrics = require('legion-metrics');

metrics.merge
-------------

### metrics.merge.algorithm(l : any, r : any)

Implements the legion merge algorithm.

Typically, this merges two plain javascript objects by recursively merging their
members. The merge rule that should be chosen for each member is defined by the
part of the member's name after the '$' sign. If there is no '$' sign then the
default rule is used.

The following merge rules are available:

 * avg: { avg : number, size : integer } + { avg : number, size : integer } -> { avg : number, size : integer }
 * max: number + number -> number
 * min: number + number -> number
 * reservoir: { reserve : [any], population\_size : integer } + { reserve : [any], population\_size : integer } -> { reserve : [any], population\_size : integer }
 * sum: number + number -> number

### metrics.merge.avg.singleton(n : number)

Returns an average object suitable for the merge algorithm.

### metrics.merge.reservoir.singleton(a : any)

Puts any object in a reservoir suitable for the merge algorithm.

### metrics.merge.reservoir.set(as : [any])

Puts a set of any objects in a reservoir suitable for the merge algorithm.

### metrics.merge.reservoir.get(reservoir : { object })

Unpacks a reservoir in an object with fields:

 * reserve : an array representing a randomly selected sub-set of the objects originally put into the reservoir
 * population\_size : the total population size represented by the reserve

Important: once you remove objects from a reservoir, you can not then put them into another reservoir. If you do so, you will not get an error, but the result will not be statistically representative.

metrics.problem(error : Error, details : object)
---------------------------------

Returns a new problem object. Objects of this type are "summarizable",
meaning that they support a summarize() method.

* error: can be a string or Error object.
* details: if provided, must be an object which will be merged into the
problem object using Object.assign().

metrics.sample(value : object, details : object)
--------------------------------

Returns a new sample point. Objects of this type are "summarizable",
meaning that they support a summarize() method.

* value: a dictionary of measurements, where each measurement has the form:
  * value: a number
  * unit: a human-readable string describing the unit of the measurement,
    such as "milliseconds" or "milliseconds since 1970".
  * interpretation: a human readable string describing the measurement.
* details: if provided, must be an object which will be merged into the
sample object using Object.assign().

### metrics.sample.duration(milliseconds : number)

Construct a duration value, in milliseconds, for use in constructing a sample.
For example:

	metrics.sample({
	  duration: metrics.sample.duration(500) // 0.5 seconds
	  timestamp: metrics.sample.timestamp()
	});

### metrics.sample.timestamp()

Construct a timestamp value, in milliseconds since 1970 (UNIX time), for use
in constructing a sample. See example above.

### metrics.sample.assertSampleValues(values : object)

Asserts that the parameter is a valid input to metrics.sample(values). If it is not, throws an exception.
The parameter must be a dictionary of the form { value: number, unit: string, interpretation: string }.

metrics.summary(summary : object)
--------------------------------

Returns a new summary object. This summary object can be used wherever
we would use a problem() or sample() object, but actually wraps the result
of a previous summarize() call. Objects of this type are "summarizable",
meaning that they support a summarize() method.

* summary: the output of a summarize() method call, or the merged output
of several summarize() method calls.

metrics.Target
--------------

A MetricsTarget is an object that merges sample points from multiple
sources into a single statistical summary. It functions as a link in
the metrics pipeline just before metrics will be persisted (to disk,
database, or elsewhere).

A MetricsReceiver is an object that provides a specific way to
deliver metrics to a MetricsTarget. MetricsReceivers are
write-only and taggable.

### metrics.Target.create(merge : object, callback : function)

Creates a new MetricsTarget.

* merge: In practice this will be the metrics.merge object, described
earlier in this document. In principle, a MetricsTarget can work with
any set of merge rules.

* callback: A callback that will fire every time a new sample is merged
with this MetricsTarget.

### metrics.Target.isTarget(something : any)

Answers true if and only if the parameter is a MetricsTarget.

### metrics.Target.isReceiver(something : any)

Answers true if and only if the parameter is a MetricsReceiver.

### metrics.Target.MetricsTarget

The prototype for all MetricsTargets.

#### metrics.Target.MetricsTarget.clear()

Deletes all of the metrics currently stored in this MetricsTarget. Returns
the metrics as though get() had been called immediately before clearing.

#### metrics.Target.MetricsTarget.get()

Get the metrics currently stored in this MetricsTarget (as a Promise).

#### metrics.Target.MetricsTarget.flush()

Triggers the callback method for this MetricsTarget. Returns a Promise
containing the output of the callback (which may be undefined or anything
else you specify).

This method is named "flush" on the assumption that the purpose of the
callback is to forward metrics onward to their ultimate destination, thus
"flushing" the MetricsTarget.

#### metrics.Target.MetricsTarget.receiver()

Returns a new MetricsReceiver that delivers samples to this MetricsTarget.

### metrics.Target.MetricsReceiver

The prototype for all MetricsReceivers.

#### metrics.Target.MetricsReceiver.receive(sample : object)

Tag and record a metrics sample, which will reside in the parent MetricsTarget.

* sample: a summarizable object (that is, an object having a summarize()
method), typically created by calling metrics.sample() to create a sample.

#### metrics.Target.MetricsReceiver.tag(tag : object, ...)

Returns a new MetricsReceiver incorporating the given tags. Tags are used to categorize
metric samples and to break down summary statistics. For example, we might
have a tag for all HTTP requests, a tag for each testcase in a load test,
or a tag for all activity that happened during the hour of 2:00-2:59 PM.

### metrics.tags

Tags that can be used to annotate sample points and sample summaries.

#### metrics.tags.generic(category : string, tag : string)

Constructs a tag for the given axis and tag name.

* category: describing the significance of the tag. For example, the
category 'protocol' might include the tags 'HTTP', 'FTP', 'SMTP', and
'WebDriver'. Alternately, 'outcome' might include the tags 'success',
'failure', and 'timeout'.

* tag: the particular tag within the given category.

#### metrics.tags.outcome(tag : string)

Constructs a tag for an outcome axis. Equivalent to
metrics.tags.generic('outcome').

##### metrics.tags.outcome.success

The outcome:success tag.

##### metrics.tags.outcome.failure

The outcome:failure tag.

##### metrics.tags.outcome.timeout

The outcome:timeout tag.

#### metrics.tags.protocol(tag : string)

Constructs a tag for the protocol axis. Equivalent to
metrics.tags.generic('protocol').

#### metrics.tags.testcase(testcase\_name : string)

Constructs a tag to label all activities within a testcase.
Equivalent to metrics.tags.generic('testcase').

#### metrics.tags.testcaseCompletion(testcase\_name : string)

Constructs a tag to instrument the completion of a testcase as a whole.
Equivalent to metrics.tags.generic('testcaseCompletion').

#### metrics.tags.step(step\_name : string)

Constructs a tag to label all activities within a user-defined step.
Equivalent to metrics.tags.generic('step').

#### metrics.tags.stepCompletion(step\_name : string)

Constructs a tag to instrument the completion of a user-defined step as a whole.
Equivalent to metrics.tags.generic('stepCompletion').

