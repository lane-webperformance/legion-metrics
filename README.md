
[![Build Status](https://travis-ci.org/lane-webperformance/legion-metrics.svg?branch=master)](https://travis-ci.org/lane-webperformance/legion-metrics)
[![Dependency Status](https://gemnasium.com/badges/github.com/lane-webperformance/legion-metrics.svg)](https://gemnasium.com/github.com/lane-webperformance/legion-metrics)

Legion-metrics is a library to capture, merge, and summarize performance
metrics from a load test.

	var metrics = require('legion-metrics');

metrics.merge
-------------

A dictionary of rules for merging two different pieces of data.

### metrics.merge.avg(l,r)

A merge rule that computes the average two values, internally stored as
{ avg, size }.

#### metrics.merge.avg.singleton()

To construct an avg object that can be merged with metrics.merge.avg.

### metrics.merge.events(l,r)

See: merge.set

### metrics.merge.max(l,r)

A merge rule that takes the maximum of two values.

### metrics.merge.min(l,r)

A merge rule that takes the minimum of two values.

### metrics.merge.mustMatch(l,r)

A merge rule that will throw an error if every value is not equal. This is a
to ensure that incompatible groups of data will not be merged to create a
misleading result.

### metrics.merge.object(l,r)

Merges two objects by recursively merging their members. The merge rule that
should be chosen for each member is defined by the part of the member's name
after the '$' sign.

Internally, objects are merged as [immutable]
(https://facebook.github.io/immutable-js/docs/#/) maps.

### metrics.merge.set(l,r)

Merges two arrays, removing duplicates. Internally, sets are merged
as immutable sets.

### metrics.merge.sum(l,r)

A merge rule that takes the sum of two values.

metrics.problem(error, [details])
---------------------------------

Returns a new problem object. Objects of this type are "summarizable",
meaning that they support a summarize() method.

* error: can be a string or Error object.
* details: if provided, must be an object which will be merged into the
problem object using Object.assign().

metrics.sample(value, [details])
--------------------------------

Returns a new sample point. Objects of this type are "summarizable",
meaning that they support a summarize() method.

* value: a dictionary of measurements, where each measurement has the form:
  * value: a number
  * units: a human-readable string describing the unit of the measurement,
    such as "milliseconds" or "milliseconds since 1970".
  * interpretation: a human readable string describing the measurement.
* details: if provided, must be an object which will be merged into the
sample object using Object.assign().

### metrics.sample.duration(milliseconds)

Construct a duration value, in milliseconds, for use in constructing a sample.
For example:

	metrics.sample({
	  duration: metrics.sample.duration(500) // 0.5 seconds
	  timestamp: metrics.sample.timestamp()
	});

### metrics.sample.timestamp()

Construct a timestamp value, in milliseconds since 1970 (UNIX time), for use
in constructing a sample. See example above.

### metrics.sample.assertSampleValues(values)

Asserts that the parameter is a valid input to metrics.sample(values). If it is not, throws an exception.
The parameter must be a dictionary of the form { value: number, unit: string, interpretation: string }.

metrics.summary(summary)
--------------------------------

Returns a new summary object. This summary object can be used wherever
we would use a problem() or sample() object, but wraps a summary
of that other data. Objects of this type are "summarizable",
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

### metrics.Target.create(merge)

Creates a new MetricsTarget.

* merge: typically the metrics.merge object, described earlier in this
document. In principle, a MetricsTarget can work with any set of merge
rules. Only the merge.object rule is strictly required.

### metrics.Target.isTarget(something)

Answers true if and only if the parameter is a MetricsTarget.

### metrics.Target.isReceiver(something)

Answers true if and only if the parameter is a MetricsReceiver.

### metrics.Target.MetricsTarget

The prototype for all MetricsTargets.

#### metrics.Target.MetricsTarget.clear()

Deletes all of the metrics currently stored in this MetricsTarget. Returns
the metrics as though get() had been called immediately before clearing.

#### metrics.Target.MetricsTarget.get()

Get the metrics currently stored in this MetricsTarget.

#### metrics.Target.MetricsTarget.receiver()

Returns a new MetricsReceiver that delivers samples to this MetricsTarget.

### metrics.Target.MetricsReceiver

The prototype for all MetricsReceivers.

#### metrics.Target.MetricsReceiver.receive(sample)

Tag and record a metrics sample, which will reside in the parent MetricsTarget.

* sample: typically an object produced by metrics.sample() or
metrics.problem().

#### metrics.Target.MetricsReceiver.tag(tag...)

Returns a new MetricsReceiver using the given tags. Tags are used to categorize
metric samples and to break down summary statistics. For example, we might
have a tag for all HTTP requests, a tag for each testcase in a load test,
or a tag for all activity that happened during the hour of 2:00-2:59 PM.

### metrics.tags

Tags that can be used to annotate sample points and sample summaries.

#### metrics.tags.generic(axis, tag)

Get a tag for the given axis and tag name.

* axis: an axis or category describing a sample point. For example, 'protocol'
(which might be HTTP or SMTP) or 'outcome' (which might be 'success' or
'failure').

* tag: the particular tag within the given axis.

#### metrics.tags.protocol(tag)

Get a tag for the protocol axis. Equivalent to
metrics.tags.generic('protocol').

#### metrics.tags.outcome(tag)

Get a tag for a outcome axis. Equivalent to
metrics.tags.generic('outcome').

##### metrics.tags.outcome.success

The outcome:success tag.

##### metrics.tags.outcome.failure

The outcome:failure tag.

##### metrics.tags.outcome.timeout

The outcome:timeout tag.

#### metrics.raw

The raw tag. This tag captures all samples, not just sample summary statistics.

