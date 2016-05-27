
[![Build Status](https://travis-ci.org/lane-webperformance/legion-metrics.svg?branch=master)](https://travis-ci.org/lane-webperformance/legion-metrics)
[![Dependency Status](https://gemnasium.com/badges/github.com/lane-webperformance/legion-metrics.svg)](https://gemnasium.com/github.com/lane-webperformance/legion-metrics)

Legion-metrics is a library to capture, merge, and summarize performance
metrics from a load test.

	var metrics = require('legion-metrics');

metrics.merge
-------------

A dictionary of rules for merging two different pieces of data.

### metrics.merge.events

See: merge.set

### metrics.merge.max

A merge rule that takes the maximum of two values.

### metrics.merge.min

A merge rule that takes the minimum of two values.

### metrics.merge.mustMatch

A merge rule that will throw an error if every value is not equal. This is a
to ensure that incompatible groups of data will not be merged to create a
misleading result.

### metrics.merge.object

Merges two objects by recursively merging their members. The merge rule that
should be chosen for each member is defined by the part of the member's name
after the '$' sign.

Internally, objects are merged as immutable
(https://facebook.github.io/immutable-js/docs/#/) maps.

### metrics.merge.set

Merges two arrays, removing duplicates. Internally, sets are merged
as immutable sets.

### metrics.merge.sum

A merge rule that takes the sum of two values.

metrics.problem(error, [details])
---------------------------------

Returns a new problem object.

* error: can be a string or Error object.
* details: if provided, must be an object which will be merged into the
problem object using Object.assign().

metrics.sample(value, [details])
--------------------------------

Returns a new sample point.

* value: can be any type, but is usually numerical, and if so, it can be
incorporated into a statistical summary.
* details: if provided, must be an object which will be merged into the
sample orbject using Object.assign().

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

